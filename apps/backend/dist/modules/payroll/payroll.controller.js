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
import { Controller, Get, Inject, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let PayrollController = class PayrollController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    // ─── PERIODS ─────────────────────────────────────────────────────────────
    getPeriods(q) { return this.svc.getPeriods(q); }
    createPeriod(dto) { return this.svc.createPeriod(dto); }
    calculate(id) { return this.svc.calculatePayroll(id); }
    calculateAll(id) { return this.svc.calculatePayroll(id); }
    approve(id) { return this.svc.approvePayroll(id); }
    process(id) { return this.svc.processPayment(id); }
    // ─── SLIPS ───────────────────────────────────────────────────────────────
    getSlips(q) { return this.svc.getSlips(q); }
    getSlip(id) { return this.svc.getSlip(id); }
    // ─── COMPONENTS ──────────────────────────────────────────────────────────
    getComponents() { return this.svc.getComponents(); }
    createComponent(dto) { return this.svc.createComponent(dto); }
    updateComponent(id, dto) {
        return this.svc.updateComponent(id, dto);
    }
    // ─── BPJS ────────────────────────────────────────────────────────────────
    getBPJSConfig(id) { return this.svc.getBPJSConfig(id); }
    upsertBPJS(id, dto) { return this.svc.upsertBPJSConfig(id, dto); }
    // ─── REPORTS ─────────────────────────────────────────────────────────────
    bpjsReport(id) { return this.svc.getBPJSReport(id); }
    pph21Report(id) { return this.svc.getPPh21Report(id); }
    summaryReport(id) { return this.svc.getPPh21Report(id); }
    // ─── BANK EXPORT ──────────────────────────────────────────────────────────
    bankExport(id, format) {
        return this.svc.bankExport(id, format ?? 'csv');
    }
    // ─── SEND EMAIL SLIPS ─────────────────────────────────────────────────────
    sendSlipEmail(id) { return this.svc.sendSlipEmail(id); }
    sendAllEmails(id) { return this.svc.sendAllSlipEmails(id); }
};
__decorate([
    Get('periods'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getPeriods", null);
__decorate([
    Post('periods'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "createPeriod", null);
__decorate([
    Post('periods/:id/calculate'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "calculate", null);
__decorate([
    Post('periods/:id/calculate-all'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "calculateAll", null);
__decorate([
    Post('periods/:id/approve'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "approve", null);
__decorate([
    Post('periods/:id/process'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "process", null);
__decorate([
    Get('slips'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getSlips", null);
__decorate([
    Get('slips/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getSlip", null);
__decorate([
    Get('components'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getComponents", null);
__decorate([
    Post('components'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "createComponent", null);
__decorate([
    Put('components/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "updateComponent", null);
__decorate([
    Get('bpjs-config/:empId'),
    __param(0, Param('empId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "getBPJSConfig", null);
__decorate([
    Post('bpjs-config/:empId'),
    __param(0, Param('empId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "upsertBPJS", null);
__decorate([
    Get('reports/bpjs/:periodId'),
    __param(0, Param('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "bpjsReport", null);
__decorate([
    Get('reports/pph21/:periodId'),
    __param(0, Param('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "pph21Report", null);
__decorate([
    Get('reports/summary/:periodId'),
    __param(0, Param('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "summaryReport", null);
__decorate([
    Get('periods/:id/bank-export'),
    __param(0, Param('id')),
    __param(1, Query('format')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "bankExport", null);
__decorate([
    Post('slips/:id/send-email'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "sendSlipEmail", null);
__decorate([
    Post('periods/:id/send-emails'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PayrollController.prototype, "sendAllEmails", null);
PayrollController = __decorate([
    Controller('payroll'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(PayrollService)),
    __metadata("design:paramtypes", [PayrollService])
], PayrollController);
export { PayrollController };
