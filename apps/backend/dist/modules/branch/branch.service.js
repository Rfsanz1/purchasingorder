var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let BranchService = class BranchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ─── COMPANY ──────────────────────────────────────────────────────────────
    async getCompanies() {
        return this.prisma.company.findMany({ include: { branches: true }, orderBy: { nama: 'asc' } });
    }
    async getCompany(id) {
        const c = await this.prisma.company.findUnique({ where: { id }, include: { branches: true } });
        if (!c)
            throw new NotFoundException('Perusahaan tidak ditemukan');
        return c;
    }
    async upsertCompany(dto) {
        if (dto.id) {
            return this.prisma.company.update({ where: { id: dto.id }, data: dto });
        }
        return this.prisma.company.create({ data: dto });
    }
    // ─── BRANCH ───────────────────────────────────────────────────────────────
    async getBranches(companyId) {
        const where = { isActive: true };
        if (companyId)
            where.companyId = companyId;
        return this.prisma.branch.findMany({ where, include: { company: true }, orderBy: { nama: 'asc' } });
    }
    async getBranch(id) {
        const b = await this.prisma.branch.findUnique({ where: { id }, include: { company: true } });
        if (!b)
            throw new NotFoundException('Cabang tidak ditemukan');
        return b;
    }
    async createBranch(dto) {
        return this.prisma.branch.create({ data: dto, include: { company: true } });
    }
    async updateBranch(id, dto) {
        return this.prisma.branch.update({ where: { id }, data: dto, include: { company: true } });
    }
    async deleteBranch(id) {
        return this.prisma.branch.update({ where: { id }, data: { isActive: false } });
    }
};
BranchService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BranchService);
export { BranchService };
