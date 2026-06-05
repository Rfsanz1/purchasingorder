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
let ManufacturingService = class ManufacturingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateMoNo() {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const count = await this.prisma.manufacturingOrder.count();
        return `MO/${year}/${month}/${String(count + 1).padStart(4, '0')}`;
    }
    async getBoms(query) {
        const { search, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { active: true };
        if (search)
            where.reference = { contains: search, mode: 'insensitive' };
        const [data, total] = await Promise.all([
            this.prisma.billOfMaterial.findMany({ where, skip, take: Number(limit), include: { components: true }, orderBy: { createdAt: 'desc' } }),
            this.prisma.billOfMaterial.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getBom(id) {
        const bom = await this.prisma.billOfMaterial.findUnique({ where: { id }, include: { components: true } });
        if (!bom)
            throw new NotFoundException('BoM tidak ditemukan');
        return bom;
    }
    async createBom(dto) {
        const { components, ...bomData } = dto;
        return this.prisma.billOfMaterial.create({ data: { ...bomData, components: { create: components ?? [] } }, include: { components: true } });
    }
    async updateBom(id, dto) { return this.prisma.billOfMaterial.update({ where: { id }, data: dto }); }
    async getWorkCenters() { return this.prisma.workCenter.findMany({ where: { active: true } }); }
    async createWorkCenter(dto) { return this.prisma.workCenter.create({ data: dto }); }
    async getOrders(query) {
        const { status, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.manufacturingOrder.findMany({ where, skip, take: Number(limit), include: { bom: { include: { components: true } }, workOrders: { include: { workCenter: true } } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.manufacturingOrder.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getOrder(id) {
        const mo = await this.prisma.manufacturingOrder.findUnique({ where: { id }, include: { bom: { include: { components: true } }, workOrders: { include: { workCenter: true } } } });
        if (!mo)
            throw new NotFoundException('Manufacturing Order tidak ditemukan');
        return mo;
    }
    async createOrder(dto) {
        const noMo = await this.generateMoNo();
        const { workOrders, ...moData } = dto;
        return this.prisma.manufacturingOrder.create({ data: { ...moData, noMo, workOrders: { create: workOrders ?? [] } }, include: { workOrders: true } });
    }
    async confirmOrder(id) { return this.prisma.manufacturingOrder.update({ where: { id }, data: { status: 'confirmed' } }); }
    async startOrder(id) { return this.prisma.manufacturingOrder.update({ where: { id }, data: { status: 'in_progress' } }); }
    async completeOrder(id, qtyProduced) { return this.prisma.manufacturingOrder.update({ where: { id }, data: { status: 'done', qtyProduced } }); }
    async getStats() {
        const [total, draft, inProgress, done] = await Promise.all([
            this.prisma.manufacturingOrder.count(),
            this.prisma.manufacturingOrder.count({ where: { status: 'draft' } }),
            this.prisma.manufacturingOrder.count({ where: { status: 'in_progress' } }),
            this.prisma.manufacturingOrder.count({ where: { status: 'done' } }),
        ]);
        return { total, draft, inProgress, done };
    }
};
ManufacturingService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], ManufacturingService);
export { ManufacturingService };
