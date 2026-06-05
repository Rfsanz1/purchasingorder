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
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary() {
        const [users, roles, notifications, permissions] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.role.count(),
            this.prisma.notification.count(),
            this.prisma.permission.count(),
        ]);
        return {
            users,
            roles,
            notifications,
            permissions,
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
        };
    }
    async getAdminSummary() {
        const [users, roles, notifications, permissions] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.role.count(),
            this.prisma.notification.count({ where: { readAt: null } }),
            this.prisma.permission.count(),
        ]);
        return {
            totalUsers: users,
            totalRoles: roles,
            unreadNotifications: notifications,
            totalPermissions: permissions,
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
        };
    }
    async getSalesSummary() {
        const [notifications] = await Promise.all([
            this.prisma.notification.count({ where: { readAt: null } }),
        ]);
        return {
            unreadNotifications: notifications,
            uptime: process.uptime(),
        };
    }
    async getGudangSummary() {
        const [notifications] = await Promise.all([
            this.prisma.notification.count({ where: { readAt: null } }),
        ]);
        return {
            unreadNotifications: notifications,
            uptime: process.uptime(),
        };
    }
    async getPosSummary() {
        const [notifications] = await Promise.all([
            this.prisma.notification.count({ where: { readAt: null } }),
        ]);
        return {
            unreadNotifications: notifications,
            uptime: process.uptime(),
        };
    }
    async getDriverSummary() {
        const [notifications] = await Promise.all([
            this.prisma.notification.count({ where: { readAt: null } }),
        ]);
        return {
            unreadNotifications: notifications,
            uptime: process.uptime(),
        };
    }
};
DashboardService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], DashboardService);
export { DashboardService };
