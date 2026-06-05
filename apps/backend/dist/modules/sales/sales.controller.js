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
import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SalesService } from './sales.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CanAccessGuard } from '../../common/guards/can-access.guard.js';
import { CanAccess } from '../../common/decorators/can-access.decorator.js';
let SalesController = class SalesController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getSummary(q) { return this.svc.getSalesSummary(q); }
    getSalesList() { return this.svc.getSalesList(); }
    // ─── Orders ─────────────────────────────────────────────────────────────────
    getOrders(q) { return this.svc.getOrders(q); }
    getOrder(id) { return this.svc.getOrder(Number(id)); }
    createOrder(dto) { return this.svc.createOrder(dto); }
    updateOrder(id, dto) { return this.svc.updateOrder(Number(id), dto); }
    deleteOrder(id) { return this.svc.deleteOrder(Number(id)); }
    updatePengiriman(id, dto) { return this.svc.updatePengiriman(Number(id), dto); }
    uploadBukti(id, b64) { return this.svc.uploadBuktiTransfer(Number(id), b64); }
    sendWa(id, dto) { return this.svc.sendWhatsAppNotification({ ...dto, id }); }
    getSales(q) { return this.svc.getSales(q); }
    getCustomerLoc(t) { return this.svc.getCustomerLocation(t); }
    saveCustomerLoc(t, dto) { return this.svc.saveCustomerLocation(t, dto.lat, dto.lng); }
    // ─── Quotations ──────────────────────────────────────────────────────────────
    getQuotations(q) { return this.svc.getQuotations(q); }
    getQuotation(id) { return this.svc.getQuotation(id); }
    createQuotation(dto) { return this.svc.createQuotation(dto); }
    updateQuotation(id, dto) { return this.svc.updateQuotation(id, dto); }
    deleteQuotation(id) { return this.svc.deleteQuotation(id); }
    confirmQuotation(id) { return this.svc.confirmQuotation(id); }
    convertQuotationToOrder(id) { return this.svc.convertQuotationToOrder(id); }
    convertQuotationToInvoice(id) { return this.svc.convertQuotationToInvoice(id); }
    sendQuotationWa(id, dto) { return this.svc.sendQuotationWhatsApp(id, dto); }
    sendQuotationEmail(id, dto) { return this.svc.sendQuotationEmail(id, dto); }
    // ─── Sales Returns ───────────────────────────────────────────────────────────
    getSalesReturns(q) { return this.svc.getSalesReturns(q); }
    getSalesReturn(id) { return this.svc.getSalesReturn(id); }
    createSalesReturn(dto) { return this.svc.createSalesReturn(dto); }
    updateSalesReturn(id, dto) { return this.svc.updateSalesReturn(id, dto); }
    validateReturn(id) { return this.svc.validateSalesReturn(id); }
    // ─── Pricelists ──────────────────────────────────────────────────────────────
    getPricelists(q) { return this.svc.getPricelists(q); }
    getPricelist(id) { return this.svc.getPricelist(id); }
    createPricelist(dto) { return this.svc.createPricelist(dto); }
    updatePricelist(id, dto) { return this.svc.updatePricelist(id, dto); }
    deletePricelist(id) { return this.svc.deletePricelist(id); }
    getPricelistItems(id) { return this.svc.getPricelistItems(id); }
    addPricelistItem(id, dto) { return this.svc.addPricelistItem(id, dto); }
};
__decorate([
    Get('summary'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getSummary", null);
__decorate([
    Get('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getSalesList", null);
__decorate([
    Get('orders'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getOrders", null);
__decorate([
    Get('orders/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getOrder", null);
__decorate([
    Post('orders'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "createOrder", null);
__decorate([
    Put('orders/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updateOrder", null);
__decorate([
    Delete('orders/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "deleteOrder", null);
__decorate([
    Patch('orders/:id/pengiriman'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updatePengiriman", null);
__decorate([
    Post('orders/:id/bukti-transfer'),
    __param(0, Param('id')),
    __param(1, Body('base64')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "uploadBukti", null);
__decorate([
    Post('orders/:id/whatsapp'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "sendWa", null);
__decorate([
    Get('faktur'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getSales", null);
__decorate([
    Get('customer-location/:token'),
    __param(0, Param('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getCustomerLoc", null);
__decorate([
    Post('customer-location/:token'),
    __param(0, Param('token')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "saveCustomerLoc", null);
__decorate([
    Get('quotations'),
    ApiOperation({ summary: 'Daftar quotation' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getQuotations", null);
__decorate([
    Get('quotations/:id'),
    ApiOperation({ summary: 'Detail quotation' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getQuotation", null);
__decorate([
    Post('quotations'),
    ApiOperation({ summary: 'Buat quotation baru' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "createQuotation", null);
__decorate([
    Put('quotations/:id'),
    ApiOperation({ summary: 'Update quotation' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updateQuotation", null);
__decorate([
    Delete('quotations/:id'),
    ApiOperation({ summary: 'Hapus quotation' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "deleteQuotation", null);
__decorate([
    Post('quotations/:id/confirm'),
    ApiOperation({ summary: 'Konfirmasi quotation → Sales Order' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "confirmQuotation", null);
__decorate([
    Post('quotations/:id/convert-to-order'),
    ApiOperation({ summary: 'Konversi quotation ke order' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "convertQuotationToOrder", null);
__decorate([
    Post('quotations/:id/convert-invoice'),
    ApiOperation({ summary: 'Konversi quotation langsung ke invoice' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "convertQuotationToInvoice", null);
__decorate([
    Post('quotations/:id/send-whatsapp'),
    ApiOperation({ summary: 'Kirim quotation via WhatsApp' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "sendQuotationWa", null);
__decorate([
    Post('quotations/:id/send-email'),
    ApiOperation({ summary: 'Kirim quotation via email' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "sendQuotationEmail", null);
__decorate([
    Get('returns'),
    ApiOperation({ summary: 'Daftar retur penjualan' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getSalesReturns", null);
__decorate([
    Get('returns/:id'),
    ApiOperation({ summary: 'Detail retur penjualan' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getSalesReturn", null);
__decorate([
    Post('returns'),
    ApiOperation({ summary: 'Buat retur penjualan' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "createSalesReturn", null);
__decorate([
    Put('returns/:id'),
    ApiOperation({ summary: 'Update retur penjualan' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updateSalesReturn", null);
__decorate([
    Post('returns/:id/validate'),
    ApiOperation({ summary: 'Validasi/approve retur → kembalikan stok' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "validateReturn", null);
__decorate([
    Get('pricelists'),
    ApiOperation({ summary: 'Daftar pricelist' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getPricelists", null);
__decorate([
    Get('pricelists/:id'),
    ApiOperation({ summary: 'Detail pricelist' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getPricelist", null);
__decorate([
    Post('pricelists'),
    ApiOperation({ summary: 'Buat pricelist baru' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "createPricelist", null);
__decorate([
    Put('pricelists/:id'),
    ApiOperation({ summary: 'Update pricelist' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updatePricelist", null);
__decorate([
    Delete('pricelists/:id'),
    ApiOperation({ summary: 'Hapus pricelist' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "deletePricelist", null);
__decorate([
    Get('pricelists/:id/items'),
    ApiOperation({ summary: 'Daftar item dalam pricelist' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getPricelistItems", null);
__decorate([
    Post('pricelists/:id/items'),
    ApiOperation({ summary: 'Tambah item ke pricelist' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "addPricelistItem", null);
SalesController = __decorate([
    ApiTags('sales'),
    ApiBearerAuth('access-token'),
    Controller('sales'),
    UseGuards(JwtAuthGuard, CanAccessGuard),
    CanAccess({ roles: ['Super Admin', 'Owner', 'Admin', 'Sales'] }),
    __param(0, Inject(SalesService)),
    __metadata("design:paramtypes", [SalesService])
], SalesController);
export { SalesController };
