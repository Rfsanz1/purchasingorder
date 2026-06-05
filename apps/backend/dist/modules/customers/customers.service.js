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
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { search, active, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (active !== undefined)
            where.active = active === 'true';
        const [data, total] = await Promise.all([
            this.prisma.customer.findMany({ where, skip, take: Number(limit), orderBy: { name: 'asc' } }),
            this.prisma.customer.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async findOne(id) {
        const c = await this.prisma.customer.findUnique({ where: { id }, include: { orders: { take: 10, orderBy: { createdAt: 'desc' } } } });
        if (!c)
            throw new NotFoundException('Customer tidak ditemukan');
        return c;
    }
    async create(dto) { return this.prisma.customer.create({ data: dto }); }
    async update(id, dto) { return this.prisma.customer.update({ where: { id }, data: dto }); }
    async remove(id) { return this.prisma.customer.update({ where: { id }, data: { active: false } }); }
    async getSummary() {
        const [total, active] = await Promise.all([
            this.prisma.customer.count(),
            this.prisma.customer.count({ where: { active: true } }),
        ]);
        return { total, active, inactive: total - active };
    }
};
CustomersService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], CustomersService);
export { CustomersService };
