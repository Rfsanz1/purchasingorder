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
import { Controller, Get, Post, Put, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { ManufacturingService } from './manufacturing.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let ManufacturingController = class ManufacturingController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getBoms(q) { return this.svc.getBoms(q); }
    createBom(dto) { return this.svc.createBom(dto); }
    getBom(id) { return this.svc.getBom(id); }
    updateBom(id, dto) { return this.svc.updateBom(id, dto); }
    getWorkCenters() { return this.svc.getWorkCenters(); }
    createWorkCenter(dto) { return this.svc.createWorkCenter(dto); }
    getOrders(q) { return this.svc.getOrders(q); }
    createOrder(dto) { return this.svc.createOrder(dto); }
    getOrder(id) { return this.svc.getOrder(id); }
    confirmOrder(id) { return this.svc.confirmOrder(id); }
    startOrder(id) { return this.svc.startOrder(id); }
    completeOrder(id, qty) { return this.svc.completeOrder(id, qty); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "getStats", null);
__decorate([
    Get('bom'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "getBoms", null);
__decorate([
    Post('bom'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "createBom", null);
__decorate([
    Get('bom/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "getBom", null);
__decorate([
    Put('bom/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "updateBom", null);
__decorate([
    Get('work-centers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "getWorkCenters", null);
__decorate([
    Post('work-centers'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "createWorkCenter", null);
__decorate([
    Get('orders'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "getOrders", null);
__decorate([
    Post('orders'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "createOrder", null);
__decorate([
    Get('orders/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "getOrder", null);
__decorate([
    Post('orders/:id/confirm'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "confirmOrder", null);
__decorate([
    Post('orders/:id/start'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "startOrder", null);
__decorate([
    Post('orders/:id/complete'),
    __param(0, Param('id')),
    __param(1, Body('qtyProduced')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ManufacturingController.prototype, "completeOrder", null);
ManufacturingController = __decorate([
    Controller('manufacturing'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(ManufacturingService)),
    __metadata("design:paramtypes", [ManufacturingService])
], ManufacturingController);
export { ManufacturingController };
