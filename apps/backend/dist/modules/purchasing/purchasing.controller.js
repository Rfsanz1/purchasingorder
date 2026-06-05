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
import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, Inject, UseGuards, Res } from '@nestjs/common';
import { PurchasingService } from './purchasing.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let PurchasingController = class PurchasingController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    // ─── STATS ────────────────────────────────────────────────────────────────────
    getStats() { return this.svc.getStats(); }
    // ─── RFQs ─────────────────────────────────────────────────────────────────────
    getRFQs(q) { return this.svc.getRfqs(q); }
    getRFQ(id) { return this.svc.getRfq(id); }
    createRFQ(dto) { return this.svc.createRfq(dto); }
    updateRFQ(id, dto) { return this.svc.updateRfq(id, dto); }
    deleteRFQ(id) { return this.svc.deleteRfq(id); }
    convertRFQ(id, dto) { return this.svc.convertRfqToPo(id, dto); }
    // ─── PURCHASE ORDERS ──────────────────────────────────────────────────────────
    getPOs(q) { return this.svc.getPurchaseOrders(q); }
    getPO(id) { return this.svc.getPurchaseOrder(id); }
    createPO(dto) { return this.svc.createPurchaseOrder(dto); }
    updatePO(id, dto) { return this.svc.updatePurchaseOrder(id, dto); }
    approvePO(id, user) { return this.svc.approvePurchaseOrder(id, user?.sub ?? 'system'); }
    cancelPO(id) { return this.svc.cancelPurchaseOrder(id); }
    changeStatus(id, status) { return this.svc.changeStatus(id, status); }
    // ─── GOODS RECEIPTS ───────────────────────────────────────────────────────────
    getGRs(q) { return this.svc.getGoodsReceipts(q); }
    getGR(id) { return this.svc.getGoodsReceipt(id); }
    createGR(dto) { return this.svc.createGoodsReceipt(dto); }
    receiveGR(id, dto) { return this.svc.receiveGoodsReceipt(id, dto); }
    getDeliveryNote(id) { return this.svc.getDeliveryNote(id); }
    // ─── VENDOR BILLS ─────────────────────────────────────────────────────────────
    getBillAging() { return this.svc.getBillAging(); }
    getBills(q) { return this.svc.getVendorBills(q); }
    getBill(id) { return this.svc.getVendorBill(id); }
    createBill(dto) { return this.svc.createVendorBill(dto); }
    updateBill(id, dto) { return this.svc.updateVendorBill(id, dto); }
    deleteBill(id) { return this.svc.deleteVendorBill(id); }
    createBillFromGr(grId, dto) { return this.svc.createBillFromGr(grId, dto); }
    addBillPayment(id, dto) { return this.svc.addBillPayment(id, dto); }
    getBillPayments(id) { return this.svc.getBillPayments(id); }
    approveBill(id) { return this.svc.approveBill(id); }
    threeWayMatch(id) { return this.svc.validateThreeWayMatch(id); }
    matchBill(id) { return this.svc.matchVendorBill(id); }
    async getBillPdf(id, res) {
        const html = await this.svc.getBillPdf(id);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    // ─── LANDED COSTS ─────────────────────────────────────────────────────────────
    getLandedCosts(q) { return this.svc.getLandedCosts(q); }
    getLandedCost(id) { return this.svc.getLandedCost(id); }
    createLandedCost(dto) { return this.svc.createLandedCost(dto); }
    updateLandedCost(id, dto) { return this.svc.updateLandedCost(id, dto); }
    validateLandedCost(id) { return this.svc.validateLandedCost(id); }
    // ─── PURCHASE RETURNS ─────────────────────────────────────────────────────────
    getReturns(q) { return this.svc.getPurchaseReturns(q); }
    getReturn(id) { return this.svc.getPurchaseReturn(id); }
    createReturn(dto) { return this.svc.createPurchaseReturn(dto); }
    updateReturn(id, dto) { return this.svc.updatePurchaseReturn(id, dto); }
    validateReturn(id) { return this.svc.validatePurchaseReturn(id); }
    // ─── SUPPLIERS ────────────────────────────────────────────────────────────────
    getSuppliers(q) { return this.svc.getSuppliers(q); }
    getSupplier(id) { return this.svc.getSupplier(id); }
    createSupplier(dto) { return this.svc.createSupplier(dto); }
    updateSupplier(id, dto) { return this.svc.updateSupplier(id, dto); }
    deleteSupplier(id) { return this.svc.deleteSupplier(id); }
    getSupplierHistory(id) { return this.svc.getSupplierHistory(id); }
    getSupplierPricelist(id) { return this.svc.getSupplierPricelist(id); }
    addSupplierPricelist(id, dto) { return this.svc.addSupplierPricelist(id, dto); }
    rateSupplier(id, dto) { return this.svc.rateSupplier(id, dto); }
    // ─── MISC ─────────────────────────────────────────────────────────────────────
    compareQuotes(q) { return this.svc.compareSupplierQuotes(q); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getStats", null);
__decorate([
    Get('rfqs'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getRFQs", null);
__decorate([
    Get('rfqs/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getRFQ", null);
__decorate([
    Post('rfqs'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "createRFQ", null);
__decorate([
    Put('rfqs/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "updateRFQ", null);
__decorate([
    Delete('rfqs/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "deleteRFQ", null);
__decorate([
    Post('rfqs/:id/convert-to-po'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "convertRFQ", null);
__decorate([
    Get('purchase-orders'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getPOs", null);
__decorate([
    Get('purchase-orders/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getPO", null);
__decorate([
    Post('purchase-orders'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "createPO", null);
__decorate([
    Put('purchase-orders/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "updatePO", null);
__decorate([
    Post('purchase-orders/:id/approve'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "approvePO", null);
__decorate([
    Post('purchase-orders/:id/cancel'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "cancelPO", null);
__decorate([
    Patch('purchase-orders/:id/status'),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "changeStatus", null);
__decorate([
    Get('goods-receipts'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getGRs", null);
__decorate([
    Get('goods-receipts/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getGR", null);
__decorate([
    Post('goods-receipts'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "createGR", null);
__decorate([
    Post('goods-receipts/:id/receive'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "receiveGR", null);
__decorate([
    Get('goods-receipts/:id/delivery-note'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getDeliveryNote", null);
__decorate([
    Get('bills/aging'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getBillAging", null);
__decorate([
    Get('bills'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getBills", null);
__decorate([
    Get('bills/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getBill", null);
__decorate([
    Post('bills'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "createBill", null);
__decorate([
    Put('bills/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "updateBill", null);
__decorate([
    Delete('bills/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "deleteBill", null);
__decorate([
    Post('bills/from-gr/:grId'),
    __param(0, Param('grId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "createBillFromGr", null);
__decorate([
    Post('bills/:id/payments'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "addBillPayment", null);
__decorate([
    Get('bills/:id/payments'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getBillPayments", null);
__decorate([
    Post('bills/:id/approve'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "approveBill", null);
__decorate([
    Get('bills/:id/three-way-match'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "threeWayMatch", null);
__decorate([
    Post('bills/:id/match'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "matchBill", null);
__decorate([
    Get('bills/:id/pdf'),
    __param(0, Param('id')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PurchasingController.prototype, "getBillPdf", null);
__decorate([
    Get('landed-costs'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getLandedCosts", null);
__decorate([
    Get('landed-costs/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getLandedCost", null);
__decorate([
    Post('landed-costs'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "createLandedCost", null);
__decorate([
    Put('landed-costs/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "updateLandedCost", null);
__decorate([
    Post('landed-costs/:id/validate'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "validateLandedCost", null);
__decorate([
    Get('returns'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getReturns", null);
__decorate([
    Get('returns/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getReturn", null);
__decorate([
    Post('returns'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "createReturn", null);
__decorate([
    Put('returns/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "updateReturn", null);
__decorate([
    Post('returns/:id/validate'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "validateReturn", null);
__decorate([
    Get('suppliers'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getSuppliers", null);
__decorate([
    Get('suppliers/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getSupplier", null);
__decorate([
    Post('suppliers'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "createSupplier", null);
__decorate([
    Put('suppliers/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "updateSupplier", null);
__decorate([
    Delete('suppliers/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "deleteSupplier", null);
__decorate([
    Get('suppliers/:id/history'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getSupplierHistory", null);
__decorate([
    Get('suppliers/:id/price-list'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "getSupplierPricelist", null);
__decorate([
    Post('suppliers/:id/price-list'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "addSupplierPricelist", null);
__decorate([
    Post('suppliers/:id/rating'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "rateSupplier", null);
__decorate([
    Get('price-comparison'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "compareQuotes", null);
PurchasingController = __decorate([
    Controller('purchasing'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(PurchasingService)),
    __metadata("design:paramtypes", [PurchasingService])
], PurchasingController);
export { PurchasingController };
