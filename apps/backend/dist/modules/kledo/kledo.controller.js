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
import { Controller, Get, Post, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { KledoService } from './kledo.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let KledoController = class KledoController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStatus() { return this.svc.getStatus(); }
    getSpmBrands() { return this.svc.getSpmBrands(); }
    getProducts(q) { return this.svc.getProducts(q); }
    getContacts(q) { return this.svc.getContacts(q); }
    getInvoices(q) { return this.svc.getInvoices(q); }
    createInvoice(dto) { return this.svc.createInvoice(dto); }
    syncProducts() { return this.svc.syncProducts(); }
    syncContacts() { return this.svc.syncContacts(); }
    syncInvoices(limit) {
        return this.svc.syncInvoices(limit ? Number(limit) : 500);
    }
    syncAll() { return this.svc.syncAll(); }
    autoSync() { return this.svc.autoSync(); }
    getSyncLogs(q) { return this.svc.getSyncLogs(q); }
};
__decorate([
    Get('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "getStatus", null);
__decorate([
    Get('spm-brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "getSpmBrands", null);
__decorate([
    Get('products'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "getProducts", null);
__decorate([
    Get('contacts'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "getContacts", null);
__decorate([
    Get('invoices'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "getInvoices", null);
__decorate([
    Post('invoices'),
    UseGuards(JwtAuthGuard),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "createInvoice", null);
__decorate([
    Post('sync'),
    UseGuards(JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "syncProducts", null);
__decorate([
    Post('sync-contacts'),
    UseGuards(JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "syncContacts", null);
__decorate([
    Post('sync-invoices'),
    UseGuards(JwtAuthGuard),
    __param(0, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "syncInvoices", null);
__decorate([
    Post('sync-all'),
    UseGuards(JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "syncAll", null);
__decorate([
    Post('auto-sync'),
    UseGuards(JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "autoSync", null);
__decorate([
    Get('sync-logs'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KledoController.prototype, "getSyncLogs", null);
KledoController = __decorate([
    Controller('kledo'),
    __param(0, Inject(KledoService)),
    __metadata("design:paramtypes", [KledoService])
], KledoController);
export { KledoController };
