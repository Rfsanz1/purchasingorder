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
var AuthService_1;
import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service.js';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
const ROLE_APP_MAP = {
    admin: 'http://localhost:3000',
    owner: 'http://localhost:3000',
    'super admin': 'http://localhost:3000',
    sales: 'http://localhost:3002',
    'sales manager': 'http://localhost:3002',
    gudang: 'http://localhost:3003',
    'staff gudang': 'http://localhost:3003',
    kasir: 'http://localhost:3004',
    driver: 'http://localhost:3005',
};
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    static resolveAppRedirect(role) {
        return ROLE_APP_MAP[role.toLowerCase()] ?? 'http://localhost:3000';
    }
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            throw new BadRequestException('Email tidak valid');
        }
        if (!password || typeof password !== 'string') {
            throw new BadRequestException('Password harus diisi');
        }
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            include: {
                role: { include: { permissions: { include: { permission: true } } } },
            },
        });
        if (!user) {
            throw new UnauthorizedException('Kredensial tidak valid');
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Kredensial tidak valid');
        }
        const roleName = user.role?.name ?? 'user';
        const permissions = user.role?.permissions?.map((rp) => rp.permission.name) ?? [];
        return { ...user, roles: [roleName], permissions };
    }
    async login(email, password) {
        const user = await this.validateUser(email, password);
        const secret = process.env.JWT_SECRET || 'change-this-secret';
        const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, roles: user.roles, permissions: user.permissions }, { secret, expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
        const refreshToken = this.jwtService.sign({ sub: user.id, email: user.email }, { secret: process.env.JWT_REFRESH_SECRET || secret, expiresIn: '7d' });
        const role = user.roles[0]?.toLowerCase() ?? '';
        const appRedirect = AuthService_1.resolveAppRedirect(role);
        return {
            token: accessToken,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role,
                roles: user.roles,
                permissions: user.permissions,
            },
            appRedirect,
        };
    }
    async logout(userId) {
        return { message: 'Logout berhasil', data: null };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
        if (!user) {
            return { message: 'Jika email terdaftar, link reset akan dikirim', data: null };
        }
        await this.prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.passwordResetToken.create({
            data: { userId: user.id, token, expiresAt },
        });
        console.log(`[FORGOT PASSWORD] Reset token for ${email}: ${token}`);
        return {
            message: 'Link reset password telah dikirim ke email Anda',
            data: process.env.NODE_ENV === 'development' ? { token, expiresAt } : null,
        };
    }
    async resetPassword(token, newPassword) {
        if (!token)
            throw new BadRequestException('Token harus diisi');
        if (!newPassword || newPassword.length < 6)
            throw new BadRequestException('Password minimal 6 karakter');
        const resetToken = await this.prisma.passwordResetToken.findUnique({ where: { token } });
        if (!resetToken || resetToken.usedAt)
            throw new BadRequestException('Token tidak valid atau sudah digunakan');
        if (resetToken.expiresAt < new Date())
            throw new BadRequestException('Token sudah kadaluarsa');
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed } });
        await this.prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } });
        return { message: 'Password berhasil direset. Silakan login kembali', data: null };
    }
    async changePassword(userId, oldPassword, newPassword) {
        if (!oldPassword)
            throw new BadRequestException('Password lama harus diisi');
        if (!newPassword || newPassword.length < 6)
            throw new BadRequestException('Password baru minimal 6 karakter');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new NotFoundException('User tidak ditemukan');
        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid)
            throw new UnauthorizedException('Password lama tidak sesuai');
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
        return { message: 'Password berhasil diubah', data: null };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'change-this-secret',
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: { role: { include: { permissions: { include: { permission: true } } } } },
            });
            if (!user)
                throw new UnauthorizedException('User tidak ditemukan');
            const roleName = user.role?.name ?? 'user';
            const permissions = user.role?.permissions?.map((rp) => rp.permission.name) ?? [];
            const secret = process.env.JWT_SECRET || 'change-this-secret';
            const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, roles: [roleName], permissions }, { secret, expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
            return { accessToken, refreshToken: token };
        }
        catch {
            throw new UnauthorizedException('Refresh token tidak valid');
        }
    }
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __param(1, Inject(JwtService)),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
