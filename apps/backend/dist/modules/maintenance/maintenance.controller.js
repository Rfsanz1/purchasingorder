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
import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let MaintenanceController = class MaintenanceController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getEquipment(q) { return this.svc.getEquipment(q); }
    createEquipment(dto) { return this.svc.createEquipment(dto); }
    updateEquipment(id, dto) { return this.svc.updateEquipment(id, dto); }
    deactivateEquipment(id) { return this.svc.deactivateEquipment(id); }
    getRequests(q) { return this.svc.getRequests(q); }
    createRequest(dto) { return this.svc.createRequest(dto); }
    getRequest(id) { return this.svc.getRequest(id); }
    updateRequest(id, dto) { return this.svc.updateRequest(id, dto); }
    closeRequest(id) { return this.svc.closeRequest(id); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "getStats", null);
__decorate([
    Get('equipment'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "getEquipment", null);
__decorate([
    Post('equipment'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "createEquipment", null);
__decorate([
    Put('equipment/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "updateEquipment", null);
__decorate([
    Delete('equipment/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "deactivateEquipment", null);
__decorate([
    Get('requests'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "getRequests", null);
__decorate([
    Post('requests'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "createRequest", null);
__decorate([
    Get('requests/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "getRequest", null);
__decorate([
    Put('requests/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "updateRequest", null);
__decorate([
    Post('requests/:id/close'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MaintenanceController.prototype, "closeRequest", null);
MaintenanceController = __decorate([
    Controller('maintenance'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(MaintenanceService)),
    __metadata("design:paramtypes", [MaintenanceService])
], MaintenanceController);
export { MaintenanceController };
