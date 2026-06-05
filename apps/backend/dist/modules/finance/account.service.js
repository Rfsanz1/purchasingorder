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
import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let AccountService = class AccountService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { type, isActive, search } = query;
        const where = {};
        if (type)
            where.type = type;
        if (isActive !== undefined)
            where.isActive = isActive === 'true';
        if (search)
            where.OR = [
                { code: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
            ];
        return this.prisma.account.findMany({
            where,
            orderBy: { code: 'asc' },
            include: { parent: { select: { id: true, code: true, name: true } } },
        });
    }
    async getTree() {
        const all = await this.prisma.account.findMany({
            where: { isActive: true },
            orderBy: { code: 'asc' },
        });
        const map = new Map();
        for (const a of all)
            map.set(a.id, { ...a, children: [] });
        const roots = [];
        for (const a of all) {
            if (a.parentId && map.has(a.parentId)) {
                map.get(a.parentId).children.push(map.get(a.id));
            }
            else if (!a.parentId) {
                roots.push(map.get(a.id));
            }
        }
        return roots;
    }
    async findOne(id) {
        const acc = await this.prisma.account.findUnique({
            where: { id },
            include: { parent: true, children: { orderBy: { code: 'asc' } } },
        });
        if (!acc)
            throw new NotFoundException(`Akun ${id} tidak ditemukan`);
        return acc;
    }
    async create(dto) {
        await this.validateKodeUnik(dto.code);
        const normalBalance = ['ASSET', 'EXPENSE'].includes(dto.type) ? 'DEBIT' : 'CREDIT';
        return this.prisma.account.create({ data: { ...dto, normalBalance } });
    }
    async update(id, dto) {
        if (dto.code) {
            const dup = await this.prisma.account.findFirst({ where: { code: dto.code, NOT: { id } } });
            if (dup)
                throw new BadRequestException(`Kode akun ${dto.code} sudah digunakan`);
        }
        return this.prisma.account.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const usedLines = await this.prisma.journalLine.count({ where: { accountId: id } });
        if (usedLines > 0)
            throw new BadRequestException('Akun tidak bisa dihapus — sudah dipakai di jurnal');
        return this.prisma.account.update({ where: { id }, data: { isActive: false } });
    }
    async validateKodeUnik(code) {
        const existing = await this.prisma.account.findFirst({ where: { code } });
        if (existing)
            throw new BadRequestException(`Kode akun ${code} sudah digunakan`);
    }
};
AccountService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], AccountService);
export { AccountService };
