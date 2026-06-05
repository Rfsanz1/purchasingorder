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
import { Controller, Get, Put, Post, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let SettingsController = class SettingsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getAll() { return this.svc.getAll(); }
    update(dto) { return this.svc.update(dto); }
    getDocumentNumbers() { return this.svc.getDocumentNumbers(); }
    updateDocumentNumber(module, dto) {
        return this.svc.updateDocumentNumber(module, dto);
    }
    getSmtp() { return this.svc.getSmtp(); }
    updateSmtp(dto) { return this.svc.updateSmtp(dto); }
    testSmtp(dto) { return this.svc.testSmtp(dto.to); }
    getFiscalYear() { return this.svc.getFiscalYear(); }
    updateFiscalYear(dto) {
        return this.svc.updateFiscalYear(dto);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAll", null);
__decorate([
    Put(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "update", null);
__decorate([
    Get('document-numbers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getDocumentNumbers", null);
__decorate([
    Put('document-numbers/:module'),
    __param(0, Param('module')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateDocumentNumber", null);
__decorate([
    Get('smtp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getSmtp", null);
__decorate([
    Put('smtp'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateSmtp", null);
__decorate([
    Post('smtp/test'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "testSmtp", null);
__decorate([
    Get('fiscal-year'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getFiscalYear", null);
__decorate([
    Put('fiscal-year'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "updateFiscalYear", null);
SettingsController = __decorate([
    Controller('settings'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(SettingsService)),
    __metadata("design:paramtypes", [SettingsService])
], SettingsController);
export { SettingsController };
