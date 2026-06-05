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
import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, Inject, UseGuards, Request } from '@nestjs/common';
import { FleetService } from './fleet.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let FleetController = class FleetController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getVehicles(q) { return this.svc.getVehicles(q); }
    createVehicle(dto) { return this.svc.createVehicle(dto); }
    getVehicle(id) { return this.svc.getVehicle(id); }
    updateVehicle(id, dto) { return this.svc.updateVehicle(id, dto); }
    deactivateVehicle(id) { return this.svc.deactivateVehicle(id); }
    getServices(q) { return this.svc.getServices(q); }
    createService(dto) { return this.svc.createService(dto); }
    // ─── Delivery Task Endpoints (untuk Driver App) ────────────────────────────
    getMyDeliveryTasks(req) {
        return this.svc.getMyDeliveryTasks(req.user);
    }
    getDeliveryTask(id) {
        return this.svc.getDeliveryTask(id);
    }
    updateDeliveryStatus(id, dto, req) {
        return this.svc.updateDeliveryStatus(id, dto, req.user);
    }
    getDeliveryHistory(q, req) {
        return this.svc.getDeliveryHistory(q, req.user);
    }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getStats", null);
__decorate([
    Get('vehicles'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getVehicles", null);
__decorate([
    Post('vehicles'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "createVehicle", null);
__decorate([
    Get('vehicles/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getVehicle", null);
__decorate([
    Put('vehicles/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "updateVehicle", null);
__decorate([
    Delete('vehicles/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "deactivateVehicle", null);
__decorate([
    Get('services'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getServices", null);
__decorate([
    Post('services'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "createService", null);
__decorate([
    Get('delivery/my-tasks'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getMyDeliveryTasks", null);
__decorate([
    Get('delivery/tasks/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getDeliveryTask", null);
__decorate([
    Patch('delivery/tasks/:id/status'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "updateDeliveryStatus", null);
__decorate([
    Get('delivery/history'),
    __param(0, Query()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getDeliveryHistory", null);
FleetController = __decorate([
    Controller('fleet'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(FleetService)),
    __metadata("design:paramtypes", [FleetService])
], FleetController);
export { FleetController };
