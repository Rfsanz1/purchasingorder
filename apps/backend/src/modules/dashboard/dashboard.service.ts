import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [users, roles, notifications, products] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.role.count(),
      this.prisma.notification.count(),
      this.prisma.permission.count(),
    ]);

    return {
      users,
      roles,
      notifications,
      permissions: products,
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
