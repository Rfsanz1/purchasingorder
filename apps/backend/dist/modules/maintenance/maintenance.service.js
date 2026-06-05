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
let MaintenanceService = class MaintenanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateMrNo() {
        const year = new Date().getFullYear();
        const count = await this.prisma.maintenanceRequest.count();
        return `MR/${year}/${String(count + 1).padStart(4, '0')}`;
    }
    async getEquipment(query) {
        const { search, category, active = 'true' } = query;
        const where = { active: active !== 'false' };
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (category)
            where.category = category;
        return this.prisma.equipment.findMany({ where, include: { _count: { select: { requests: true } } }, orderBy: { name: 'asc' } });
    }
    async createEquipment(dto) { return this.prisma.equipment.create({ data: dto }); }
    async updateEquipment(id, dto) { return this.prisma.equipment.update({ where: { id }, data: dto }); }
    async deactivateEquipment(id) { return this.prisma.equipment.update({ where: { id }, data: { active: false } }); }
    async getRequests(query) {
        const { status, type, equipmentId, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (equipmentId)
            where.equipmentId = equipmentId;
        const [data, total] = await Promise.all([
            this.prisma.maintenanceRequest.findMany({ where, skip, take: Number(limit), include: { equipment: true }, orderBy: [{ priority: 'desc' }, { requestDate: 'desc' }] }),
            this.prisma.maintenanceRequest.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getRequest(id) {
        const r = await this.prisma.maintenanceRequest.findUnique({ where: { id }, include: { equipment: true } });
        if (!r)
            throw new NotFoundException('Permintaan maintenance tidak ditemukan');
        return r;
    }
    async createRequest(dto) {
        const noMr = await this.generateMrNo();
        return this.prisma.maintenanceRequest.create({ data: { ...dto, noMr }, include: { equipment: true } });
    }
    async updateRequest(id, dto) { return this.prisma.maintenanceRequest.update({ where: { id }, data: dto }); }
    async closeRequest(id) { return this.prisma.maintenanceRequest.update({ where: { id }, data: { status: 'done', closedDate: new Date() } }); }
    async getStats() {
        const [total, open, inProgress, done, overdue] = await Promise.all([
            this.prisma.maintenanceRequest.count(),
            this.prisma.maintenanceRequest.count({ where: { status: 'new' } }),
            this.prisma.maintenanceRequest.count({ where: { status: 'in_progress' } }),
            this.prisma.maintenanceRequest.count({ where: { status: 'done' } }),
            this.prisma.maintenanceRequest.count({ where: { status: { notIn: ['done', 'cancelled'] }, scheduledDate: { lt: new Date() } } }),
        ]);
        return { total, open, inProgress, done, overdue };
    }
};
MaintenanceService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], MaintenanceService);
export { MaintenanceService };
