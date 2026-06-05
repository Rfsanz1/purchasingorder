var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let FleetService = class FleetService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVehicles(query) {
        const { search, active = 'true', fuelType } = query;
        const where = { active: active !== 'false' };
        if (search)
            where.OR = [{ licensePlate: { contains: search, mode: 'insensitive' } }, { brand: { contains: search, mode: 'insensitive' } }];
        if (fuelType)
            where.fuelType = fuelType;
        return this.prisma.vehicle.findMany({ where, include: { _count: { select: { services: true } } }, orderBy: { licensePlate: 'asc' } });
    }
    async getVehicle(id) {
        const v = await this.prisma.vehicle.findUnique({ where: { id }, include: { services: { orderBy: { date: 'desc' }, take: 10 } } });
        if (!v)
            throw new NotFoundException('Kendaraan tidak ditemukan');
        return v;
    }
    async createVehicle(dto) { return this.prisma.vehicle.create({ data: dto }); }
    async updateVehicle(id, dto) { return this.prisma.vehicle.update({ where: { id }, data: dto }); }
    async deactivateVehicle(id) { return this.prisma.vehicle.update({ where: { id }, data: { active: false } }); }
    async getServices(query) {
        const { vehicleId, type, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (vehicleId)
            where.vehicleId = vehicleId;
        if (type)
            where.type = type;
        const [data, total] = await Promise.all([
            this.prisma.vehicleService.findMany({ where, skip, take: Number(limit), include: { vehicle: true }, orderBy: { date: 'desc' } }),
            this.prisma.vehicleService.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async createService(dto) { return this.prisma.vehicleService.create({ data: dto, include: { vehicle: true } }); }
    async getStats() {
        const [total, active] = await Promise.all([
            this.prisma.vehicle.count(),
            this.prisma.vehicle.count({ where: { active: true } }),
        ]);
        const overdueServices = await this.prisma.vehicleService.findMany({
            where: { nextService: { lte: new Date() } },
            select: { vehicleId: true },
            distinct: ['vehicleId'],
        });
        const totalCost = await this.prisma.vehicleService.aggregate({ _sum: { cost: true } });
        return { total, active, needService: overdueServices.length, totalServiceCost: totalCost._sum.cost ?? 0 };
    }
    // ─── Delivery Task Methods (Driver App) ────────────────────────────────────
    async getMyDeliveryTasks(currentUser) {
        const driverName = currentUser?.name ?? '';
        try {
            const orders = await this.prisma.order.findMany({
                where: {
                    OR: [
                        { driverName: { contains: driverName, mode: 'insensitive' } },
                        { status: { in: ['confirmed', 'picking', 'ready', 'shipping'] } },
                    ],
                    NOT: { statusPengiriman: { in: ['delivered', 'failed'] } },
                },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });
            return orders.map((o) => ({
                id: String(o.id),
                soNumber: `SO-${o.id}`,
                customerName: o.namaCustomer,
                phone: o.noHp ?? '',
                address: o.alamat ?? '',
                items: Array.isArray(o.items) ? o.items : [],
                status: this.mapDeliveryStatus(o.statusPengiriman),
                time: new Date(o.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                notes: o.catatan ?? '',
            }));
        }
        catch {
            return [];
        }
    }
    async getDeliveryTask(id) {
        try {
            const o = await this.prisma.order.findUnique({
                where: { id: parseInt(id) },
                include: { orderItems: true },
            });
            if (!o)
                return null;
            return {
                id: String(o.id),
                soNumber: `SO-${o.id}`,
                customerName: o.namaCustomer,
                phone: o.noHp ?? '',
                address: o.alamat ?? '',
                notes: o.catatan ?? '',
                status: this.mapDeliveryStatus(o.statusPengiriman),
                items: (o.orderItems ?? []).map((item) => ({
                    name: item.namaBarang ?? item.productName ?? 'Item',
                    qty: item.qty ?? item.jumlah ?? 1,
                    unit: item.satuan ?? 'pcs',
                })),
            };
        }
        catch {
            return null;
        }
    }
    async updateDeliveryStatus(id, dto, currentUser) {
        const { status, notes, photo } = dto;
        const statusMap = {
            on_the_way: 'shipping',
            arrived: 'arrived',
            delivered: 'delivered',
            failed: 'failed',
        };
        const newStatus = statusMap[status] ?? status;
        try {
            await this.prisma.order.update({
                where: { id: parseInt(id) },
                data: {
                    statusPengiriman: newStatus,
                    ...(newStatus === 'delivered' && { fotoPengiriman: photo ? 'uploaded' : null }),
                    ...(notes && { catatan: notes }),
                },
            });
        }
        catch { }
        return { success: true, id, status: newStatus };
    }
    async getDeliveryHistory(query, currentUser) {
        const driverName = currentUser?.name ?? '';
        try {
            const orders = await this.prisma.order.findMany({
                where: {
                    OR: [
                        { driverName: { contains: driverName, mode: 'insensitive' } },
                        { statusPengiriman: { in: ['delivered', 'failed'] } },
                    ],
                },
                orderBy: { updatedAt: 'desc' },
                take: 100,
            });
            return orders.map((o) => ({
                id: String(o.id),
                soNumber: `SO-${o.id}`,
                customerName: o.namaCustomer,
                address: o.alamat ?? '',
                items: Array.isArray(o.items) ? o.items.length : 0,
                status: o.statusPengiriman === 'delivered' ? 'delivered' : 'failed',
                date: o.updatedAt?.toISOString()?.split('T')[0] ?? new Date().toISOString().split('T')[0],
            }));
        }
        catch {
            return [];
        }
    }
    mapDeliveryStatus(statusPengiriman) {
        const map = {
            shipping: 'on_the_way',
            arrived: 'arrived',
            delivered: 'delivered',
            failed: 'failed',
        };
        return map[statusPengiriman ?? ''] ?? 'assigned';
    }
};
FleetService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], FleetService);
export { FleetService };
