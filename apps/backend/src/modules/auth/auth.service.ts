import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service.js';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const ROLE_APP_MAP: Record<string, string> = {
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

@Injectable()
export class AuthService {
  static resolveAppRedirect(role: string): string {
    return ROLE_APP_MAP[role.toLowerCase()] ?? 'http://localhost:3000';
  }

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
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

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const secret = process.env.JWT_SECRET || 'change-this-secret';

    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, roles: user.roles, permissions: user.permissions },
      { secret, expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_REFRESH_SECRET || secret, expiresIn: '7d' },
    );

    const role = user.roles[0]?.toLowerCase() ?? '';
    const appRedirect = AuthService.resolveAppRedirect(role);

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

  async logout(userId: string) {
    return { message: 'Logout berhasil', data: null };
  }

  async forgotPassword(email: string) {
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

  async resetPassword(token: string, newPassword: string) {
    if (!token) throw new BadRequestException('Token harus diisi');
    if (!newPassword || newPassword.length < 6) throw new BadRequestException('Password minimal 6 karakter');

    const resetToken = await this.prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.usedAt) throw new BadRequestException('Token tidak valid atau sudah digunakan');
    if (resetToken.expiresAt < new Date()) throw new BadRequestException('Token sudah kadaluarsa');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed } });
    await this.prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } });

    return { message: 'Password berhasil direset. Silakan login kembali', data: null };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    if (!oldPassword) throw new BadRequestException('Password lama harus diisi');
    if (!newPassword || newPassword.length < 6) throw new BadRequestException('Password baru minimal 6 karakter');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) throw new UnauthorizedException('Password lama tidak sesuai');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return { message: 'Password berhasil diubah', data: null };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'change-this-secret',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: { include: { permissions: { include: { permission: true } } } } },
      });

      if (!user) throw new UnauthorizedException('User tidak ditemukan');

      const roleName = user.role?.name ?? 'user';
      const permissions = user.role?.permissions?.map((rp) => rp.permission.name) ?? [];
      const secret = process.env.JWT_SECRET || 'change-this-secret';

      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, roles: [roleName], permissions },
        { secret, expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
      );

      return { accessToken, refreshToken: token };
    } catch {
      throw new UnauthorizedException('Refresh token tidak valid');
    }
  }
}
