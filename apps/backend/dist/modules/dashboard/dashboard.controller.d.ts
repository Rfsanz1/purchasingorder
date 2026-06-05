import { DashboardService } from './dashboard.service.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    summary(): Promise<{
        users: number;
        roles: number;
        notifications: number;
        permissions: number;
        uptime: number;
        version: string;
    }>;
    adminDashboard(): Promise<{
        totalUsers: number;
        totalRoles: number;
        unreadNotifications: number;
        totalPermissions: number;
        uptime: number;
        version: string;
    }>;
    salesDashboard(): Promise<{
        unreadNotifications: number;
        uptime: number;
    }>;
    gudangDashboard(): Promise<{
        unreadNotifications: number;
        uptime: number;
    }>;
    posDashboard(): Promise<{
        unreadNotifications: number;
        uptime: number;
    }>;
    driverDashboard(): Promise<{
        unreadNotifications: number;
        uptime: number;
    }>;
}
