import { PrismaService } from '../../database/prisma.service.js';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(): Promise<{
        users: number;
        roles: number;
        notifications: number;
        permissions: number;
        uptime: number;
        version: string;
    }>;
    getAdminSummary(): Promise<{
        totalUsers: number;
        totalRoles: number;
        unreadNotifications: number;
        totalPermissions: number;
        uptime: number;
        version: string;
    }>;
    getSalesSummary(): Promise<{
        unreadNotifications: number;
        uptime: number;
    }>;
    getGudangSummary(): Promise<{
        unreadNotifications: number;
        uptime: number;
    }>;
    getPosSummary(): Promise<{
        unreadNotifications: number;
        uptime: number;
    }>;
    getDriverSummary(): Promise<{
        unreadNotifications: number;
        uptime: number;
    }>;
}
