import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roleName = user.role?.name ?? 'user';
    const permissions = user.role?.permissions?.map((rp) => rp.permission.name) ?? [];

    return {
      ...user,
      roles: [roleName],
      permissions,
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email, roles: user.roles, permissions: user.permissions },
      {
        secret: process.env.JWT_SECRET || 'change-this-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'change-this-secret',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      },
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'change-this-secret',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          role: { include: { permissions: { include: { permission: true } } } },
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const roleName = user.role?.name ?? 'user';
      const permissions = user.role?.permissions?.map((rp) => rp.permission.name) ?? [];

      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, roles: [roleName], permissions },
        {
          secret: process.env.JWT_SECRET || 'change-this-secret',
          expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        },
      );

      return { accessToken, refreshToken: token };
    } catch {
      throw new UnauthorizedException('Refresh token invalid');
    }
  }
}
