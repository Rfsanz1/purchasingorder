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
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async summary() {
        return this.dashboardService.getSummary();
    }
    async adminDashboard() {
        return this.dashboardService.getAdminSummary();
    }
    async salesDashboard() {
        return this.dashboardService.getSalesSummary();
    }
    async gudangDashboard() {
        return this.dashboardService.getGudangSummary();
    }
    async posDashboard() {
        return this.dashboardService.getPosSummary();
    }
    async driverDashboard() {
        return this.dashboardService.getDriverSummary();
    }
};
__decorate([
    Get('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "summary", null);
__decorate([
    Get('admin'),
    Roles('admin', 'owner', 'super admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "adminDashboard", null);
__decorate([
    Get('sales'),
    Roles('admin', 'owner', 'super admin', 'sales', 'sales manager'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "salesDashboard", null);
__decorate([
    Get('gudang'),
    Roles('admin', 'owner', 'super admin', 'staff gudang', 'gudang'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "gudangDashboard", null);
__decorate([
    Get('pos'),
    Roles('admin', 'owner', 'super admin', 'kasir'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "posDashboard", null);
__decorate([
    Get('driver'),
    Roles('admin', 'owner', 'super admin', 'driver'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "driverDashboard", null);
DashboardController = __decorate([
    Controller('dashboard'),
    UseGuards(JwtAuthGuard, RolesGuard),
    __param(0, Inject(DashboardService)),
    __metadata("design:paramtypes", [DashboardService])
], DashboardController);
export { DashboardController };
