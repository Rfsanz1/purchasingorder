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
import { Controller, Get, Post, Put, Patch, Param, Body, Query, Inject, UseGuards, Request } from '@nestjs/common';
import { PosService } from './pos.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let PosController = class PosController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    login(dto) {
        return this.svc.login(dto.username, dto.password);
    }
    getDashboard() {
        return this.svc.getDashboard();
    }
    getProducts(q) {
        return this.svc.getProducts(q);
    }
    createProduct(dto) {
        return this.svc.createProduct(dto);
    }
    updateProduct(id, dto) {
        return this.svc.updateProduct(id, dto);
    }
    patchProduct(id, dto) {
        return this.svc.updateProduct(id, dto);
    }
    getCategories() {
        return this.svc.getCategories();
    }
    getSales(q) {
        return this.svc.getSales(q);
    }
    createSale(dto) {
        return this.svc.createSale(dto);
    }
    // ─── Transactions (alias for sales) ────────────────────────────────────────
    getTransactions(q) {
        return this.svc.getSales(q);
    }
    getTransaction(id) {
        return this.svc.getTransaction(id);
    }
    createTransaction(dto) {
        return this.svc.createSale(dto);
    }
    holdTransaction(dto) {
        return this.svc.holdTransaction(dto);
    }
    getHeldTransactions() {
        return this.svc.getHeldTransactions();
    }
    resumeTransaction(id, dto) {
        return this.svc.resumeTransaction(id, dto);
    }
    returnTransaction(id, dto) {
        return this.svc.returnTransaction(id, dto);
    }
    getReceipt(id) {
        return this.svc.getReceipt(id);
    }
    syncTransactions(dto) {
        return this.svc.syncTransactions(dto.transactions || []);
    }
    // ─── Sessions ─────────────────────────────────────────────────────────────
    getSessions(q) {
        return this.svc.getSessions(q);
    }
    getActiveSession(req) {
        return this.svc.getActiveSession(req.user);
    }
    openSession(dto, req) {
        return this.svc.openSession(dto, req.user);
    }
    closeSession(id, dto) {
        return this.svc.closeSession(id, dto);
    }
    getSession(id) {
        return this.svc.getSession(id);
    }
    getSessionReport(id) {
        return this.svc.getSessionReport(id);
    }
    // ─── Loyalty ──────────────────────────────────────────────────────────────
    getLoyaltyConfig() {
        return this.svc.getLoyaltyConfig();
    }
    updateLoyaltyConfig(dto) {
        return this.svc.updateLoyaltyConfig(dto);
    }
    getCustomerLoyalty(customerId) {
        return this.svc.getCustomerLoyalty(customerId);
    }
    redeemLoyalty(dto) {
        return this.svc.redeemLoyalty(dto);
    }
    // ─── Reports ──────────────────────────────────────────────────────────────
    getTodayReport() {
        return this.svc.getTodayReport();
    }
    getDailyReports(q) {
        return this.svc.getReportsDaily(q);
    }
    getProductReports(q) {
        return this.svc.getReportsProducts(q);
    }
    getPaymentReports(q) {
        return this.svc.getReportsPayments(q);
    }
    getCashierReports(q) {
        return this.svc.getReportsCashiers(q);
    }
};
__decorate([
    Post('auth/login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "login", null);
__decorate([
    Get('dashboard'),
    UseGuards(JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getDashboard", null);
__decorate([
    Get('products'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getProducts", null);
__decorate([
    Post('products'),
    UseGuards(JwtAuthGuard),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "createProduct", null);
__decorate([
    Put('products/:id'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "updateProduct", null);
__decorate([
    Patch('products/:id'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "patchProduct", null);
__decorate([
    Get('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getCategories", null);
__decorate([
    Get('sales'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getSales", null);
__decorate([
    Post('sales'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "createSale", null);
__decorate([
    Get('transactions'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getTransactions", null);
__decorate([
    Get('transactions/:id'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getTransaction", null);
__decorate([
    Post('transactions'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "createTransaction", null);
__decorate([
    Post('transactions/hold'),
    UseGuards(JwtAuthGuard),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "holdTransaction", null);
__decorate([
    Get('transactions/held'),
    UseGuards(JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getHeldTransactions", null);
__decorate([
    Post('transactions/:id/resume'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "resumeTransaction", null);
__decorate([
    Post('transactions/:id/return'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "returnTransaction", null);
__decorate([
    Get('transactions/:id/receipt'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getReceipt", null);
__decorate([
    Post('transactions/sync'),
    UseGuards(JwtAuthGuard),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "syncTransactions", null);
__decorate([
    Get('sessions'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getSessions", null);
__decorate([
    Get('sessions/active'),
    UseGuards(JwtAuthGuard),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getActiveSession", null);
__decorate([
    Post('sessions/open'),
    UseGuards(JwtAuthGuard),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "openSession", null);
__decorate([
    Post('sessions/:id/close'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "closeSession", null);
__decorate([
    Get('sessions/:id'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getSession", null);
__decorate([
    Get('sessions/:id/report'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getSessionReport", null);
__decorate([
    Get('loyalty/config'),
    UseGuards(JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getLoyaltyConfig", null);
__decorate([
    Put('loyalty/config'),
    UseGuards(JwtAuthGuard),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "updateLoyaltyConfig", null);
__decorate([
    Get('loyalty/customers/:customerId'),
    UseGuards(JwtAuthGuard),
    __param(0, Param('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getCustomerLoyalty", null);
__decorate([
    Post('loyalty/redeem'),
    UseGuards(JwtAuthGuard),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "redeemLoyalty", null);
__decorate([
    Get('reports/today'),
    UseGuards(JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getTodayReport", null);
__decorate([
    Get('reports/daily'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getDailyReports", null);
__decorate([
    Get('reports/products'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getProductReports", null);
__decorate([
    Get('reports/payments'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getPaymentReports", null);
__decorate([
    Get('reports/cashiers'),
    UseGuards(JwtAuthGuard),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "getCashierReports", null);
PosController = __decorate([
    Controller('pos'),
    __param(0, Inject(PosService)),
    __metadata("design:paramtypes", [PosService])
], PosController);
export { PosController };
