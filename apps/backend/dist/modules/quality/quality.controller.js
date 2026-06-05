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
import { QualityService } from './quality.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let QualityController = class QualityController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getQcps(q) { return this.svc.getQcps(q); }
    createQcp(dto) { return this.svc.createQcp(dto); }
    updateQcp(id, dto) { return this.svc.updateQcp(id, dto); }
    getChecks(q) { return this.svc.getChecks(q); }
    createCheck(dto) { return this.svc.createCheck(dto); }
    passCheck(id, val) { return this.svc.passCheck(id, val); }
    failCheck(id, notes) { return this.svc.failCheck(id, notes); }
    getAlerts(q) { return this.svc.getAlerts(q); }
    createAlert(dto) { return this.svc.createAlert(dto); }
    updateAlert(id, dto) { return this.svc.updateAlert(id, dto); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "getStats", null);
__decorate([
    Get('qcp'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "getQcps", null);
__decorate([
    Post('qcp'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "createQcp", null);
__decorate([
    Put('qcp/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "updateQcp", null);
__decorate([
    Get('checks'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "getChecks", null);
__decorate([
    Post('checks'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "createCheck", null);
__decorate([
    Post('checks/:id/pass'),
    __param(0, Param('id')),
    __param(1, Body('measuredValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "passCheck", null);
__decorate([
    Post('checks/:id/fail'),
    __param(0, Param('id')),
    __param(1, Body('notes')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "failCheck", null);
__decorate([
    Get('alerts'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "getAlerts", null);
__decorate([
    Post('alerts'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "createAlert", null);
__decorate([
    Put('alerts/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QualityController.prototype, "updateAlert", null);
QualityController = __decorate([
    Controller('quality'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(QualityService)),
    __metadata("design:paramtypes", [QualityService])
], QualityController);
export { QualityController };
