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
import { ConflictException, Inject, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import * as bcrypt from 'bcrypt';
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCurrentUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                role: { include: { permissions: { include: { permission: true } } } },
            },
        });
        if (!user)
            throw new NotFoundException('User not found');
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: [user.role.name],
            permissions: user.role.permissions.map((rp) => rp.permission.name),
        };
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                role: { include: { permissions: { include: { permission: true } } } },
            },
        });
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            include: { role: true },
            orderBy: { createdAt: 'asc' },
        });
        return users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role.name,
            roleId: u.roleId,
            active: u.active,
            createdAt: u.createdAt,
        }));
    }
    async create(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new ConflictException('Email sudah terdaftar');
        const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
        if (!role)
            throw new NotFoundException('Role tidak ditemukan');
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: { name: dto.name, email: dto.email, password: hashed, roleId: dto.roleId, active: true },
            include: { role: true },
        });
        return { id: user.id, name: user.name, email: user.email, role: user.role.name, roleId: user.roleId, active: user.active, createdAt: user.createdAt };
    }
    async update(id, dto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new NotFoundException('User tidak ditemukan');
        if (dto.email && dto.email !== user.email) {
            const conflict = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (conflict)
                throw new ConflictException('Email sudah digunakan');
        }
        if (dto.roleId) {
            const role = await this.prisma.role.findUnique({ where: { id: dto.roleId } });
            if (!role)
                throw new NotFoundException('Role tidak ditemukan');
        }
        const data = {};
        if (dto.name)
            data.name = dto.name;
        if (dto.email)
            data.email = dto.email;
        if (dto.password)
            data.password = await bcrypt.hash(dto.password, 10);
        if (dto.roleId)
            data.roleId = dto.roleId;
        const updated = await this.prisma.user.update({ where: { id }, data, include: { role: true } });
        return { id: updated.id, name: updated.name, email: updated.email, role: updated.role.name, roleId: updated.roleId, active: updated.active, createdAt: updated.createdAt };
    }
    async toggleActive(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new NotFoundException('User tidak ditemukan');
        const updated = await this.prisma.user.update({ where: { id }, data: { active: !user.active }, include: { role: true } });
        return { id: updated.id, name: updated.name, email: updated.email, role: updated.role.name, roleId: updated.roleId, active: updated.active, createdAt: updated.createdAt };
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new NotFoundException('User tidak ditemukan');
        await this.prisma.user.delete({ where: { id } });
        return { success: true };
    }
};
UserService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], UserService);
export { UserService };
