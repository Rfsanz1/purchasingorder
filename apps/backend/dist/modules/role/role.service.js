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
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let RoleService = class RoleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const data = await this.prisma.role.findMany({
            include: { permissions: { include: { permission: true } } },
            orderBy: { name: 'asc' },
        });
        return { data, message: 'success' };
    }
    async findPermissions() {
        const data = await this.prisma.permission.findMany({ orderBy: { name: 'asc' } });
        return { data, message: 'success' };
    }
    async findOne(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: {
                permissions: { include: { permission: true } },
                users: { select: { id: true, name: true, email: true } },
            },
        });
        if (!role)
            throw new NotFoundException('Role tidak ditemukan');
        return { data: role, message: 'success' };
    }
    async create(dto) {
        if (!dto.name?.trim())
            throw new BadRequestException('Nama role harus diisi');
        const existing = await this.prisma.role.findUnique({ where: { name: dto.name } });
        if (existing)
            throw new ConflictException(`Role "${dto.name}" sudah ada`);
        const data = await this.prisma.role.create({ data: { name: dto.name.trim(), description: dto.description } });
        return { data, message: 'Role berhasil dibuat' };
    }
    async update(id, dto) {
        await this.findOne(id);
        if (dto.name) {
            const conflict = await this.prisma.role.findFirst({ where: { name: dto.name, NOT: { id } } });
            if (conflict)
                throw new ConflictException(`Role "${dto.name}" sudah ada`);
        }
        const data = await this.prisma.role.update({ where: { id }, data: dto });
        return { data, message: 'Role berhasil diupdate' };
    }
    async remove(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: { users: { select: { id: true } } },
        });
        if (!role)
            throw new NotFoundException('Role tidak ditemukan');
        if (role.users.length > 0) {
            throw new BadRequestException(`Role masih digunakan oleh ${role.users.length} pengguna. Pindahkan pengguna terlebih dahulu.`);
        }
        await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
        await this.prisma.role.delete({ where: { id } });
        return { data: null, message: 'Role berhasil dihapus' };
    }
    async assignPermissions(roleId, permissionIds) {
        await this.findOne(roleId);
        await this.prisma.rolePermission.deleteMany({ where: { roleId } });
        if (permissionIds.length > 0) {
            await this.prisma.rolePermission.createMany({
                data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
                skipDuplicates: true,
            });
        }
        const updated = await this.prisma.role.findUnique({
            where: { id: roleId },
            include: { permissions: { include: { permission: true } } },
        });
        return { data: updated, message: `${permissionIds.length} permission berhasil di-assign ke role` };
    }
};
RoleService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], RoleService);
export { RoleService };
