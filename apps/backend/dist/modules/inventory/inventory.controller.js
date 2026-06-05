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
import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InventoryService } from './inventory.service.js';
import { CostingService } from './costing.service.js';
import { LandedCostService } from './landed-cost.service.js';
import { ValuationService } from './valuation.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let InventoryController = class InventoryController {
    svc;
    costing;
    landedCost;
    valuation;
    constructor(svc, costing, landedCost, valuation) {
        this.svc = svc;
        this.costing = costing;
        this.landedCost = landedCost;
        this.valuation = valuation;
    }
    // ─── EXISTING ROUTES (tidak diubah) ───────────────────────────────────────
    getStats() { return this.svc.getStats(); }
    getProducts(q) { return this.svc.getProducts(q); }
    getBrands() { return this.svc.getBrands(); }
    getProduct(id) { return this.svc.getProduct(id); }
    createProduct(dto) { return this.svc.createProduct(dto); }
    updateProduct(id, dto) { return this.svc.updateProduct(id, dto); }
    deleteProduct(id) { return this.svc.deleteProduct(id); }
    updateStok(id, dto) { return this.svc.updateStok(id, dto.qty, dto.type, dto.note); }
    // Product variants
    getVariants(id) { return this.svc.getVariants(id); }
    createVariant(id, dto) { return this.svc.createVariant(id, dto); }
    updateVariant(id, variantId, dto) { return this.svc.updateVariant(id, variantId, dto); }
    deleteVariant(id, variantId) { return this.svc.deleteVariant(id, variantId); }
    // Product bundle components
    getBundleComponents(id) { return this.svc.getBundleComponents(id); }
    addBundleComponent(id, dto) { return this.svc.addBundleComponent(id, dto); }
    // Tier prices
    getTierPrices(id) { return this.svc.getTierPrices(id); }
    addTierPrice(id, dto) { return this.svc.addTierPrice(id, dto); }
    // Unit conversions
    getUnitConversions() { return this.svc.getUnitConversions(); }
    addUnitConversion(dto) { return this.svc.addUnitConversion(dto); }
    // Import / Export products
    importProducts(file, body) {
        if (file && file.buffer)
            return this.svc.importProducts(file.buffer);
        if (body && body.fileBase64)
            return this.svc.importProducts(body.fileBase64);
        return { message: 'No file provided' };
    }
    async exportProducts(q, res) {
        const out = await this.svc.exportProducts(q);
        if (q && q.download === 'true') {
            const buf = Buffer.from(out.content, 'base64');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${out.filename}"`);
            return res.send(buf);
        }
        return out;
    }
    async importTemplate(res, q) {
        const out = await this.svc.importTemplate();
        if (q && q.download === 'true') {
            const buf = Buffer.from(out.content, 'base64');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${out.filename}"`);
            return res.send(buf);
        }
        return out;
    }
    getMovements(q) { return this.svc.getStockMovements(q); }
    getOpnames(q) { return this.svc.getStockOpnames(q); }
    createOpname(dto) { return this.svc.createStockOpname(dto); }
    validateOpname(id) { return this.svc.validateStockOpname(id); }
    async exportOpname(id, q, res) {
        const out = await this.svc.exportStockOpname(id);
        if (q && q.download === 'true') {
            const buf = Buffer.from(out.content, 'base64');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${out.filename}"`);
            return res.send(buf);
        }
        return out;
    }
    importOpname(id, file, body) {
        if (file && file.buffer)
            return this.svc.importStockOpname(id, file.buffer);
        if (body && body.fileBase64)
            return this.svc.importStockOpname(id, body.fileBase64);
        return { message: 'No file provided' };
    }
    getWarehouses() { return this.svc.getWarehouses(); }
    getCategories() { return this.svc.getCategories(); }
    getUnits() { return this.svc.getUnits(); }
    // ─── COSTING ROUTES ───────────────────────────────────────────────────────
    calculateFIFO(dto) {
        return this.costing.calculateFIFO(dto.productId, dto.qty);
    }
    commitFIFO(dto) {
        return this.costing.commitFIFO(dto.productId, dto.qty, dto.referenceId);
    }
    updateAverageCost(dto) {
        return this.costing.calculateAverageCost(dto.productId, dto.qtyMasuk, dto.unitCost);
    }
    revaluate(dto) {
        return this.costing.revaluateStock(dto.productId, dto.newCost, dto.note);
    }
    createCostLot(dto) {
        return this.costing.createLot({
            ...dto,
            expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        });
    }
    // ─── LANDED COST ROUTES ───────────────────────────────────────────────────
    getLandedCosts(q) {
        return this.landedCost.findAll(q);
    }
    getLandedCost(id) {
        return this.landedCost.findOne(id);
    }
    createLandedCost(dto) {
        return this.landedCost.createDraft(dto);
    }
    applyLandedCosts(dto) {
        return this.landedCost.applyLandedCost(dto.purchaseId, dto.costs);
    }
    validateLandedCost(id) {
        return this.landedCost.validate(id);
    }
    // ─── VALUATION ROUTES ─────────────────────────────────────────────────────
    getValuationStats(warehouseId) {
        return this.valuation.getValuationStats(warehouseId);
    }
    getStockValuation(date, warehouseId) {
        return this.valuation.getStockValuation(date ? new Date(date) : undefined, warehouseId);
    }
    getStockAging(warehouseId) {
        return this.valuation.getStockAgingReport(warehouseId);
    }
    getSlowMoving(days, warehouseId) {
        return this.valuation.getSlowMovingItems(days ? Number(days) : 90, warehouseId);
    }
    getStockLots(q) {
        return this.valuation.getStockLots(q);
    }
    // Lots / Serials
    getLots(q) { return this.svc.getLots(q); }
    getLot(id) { return this.svc.getLot(id); }
    createLot(dto) { return this.svc.createLot(dto); }
    traceLot(id) { return this.svc.getLotTrace(id); }
    getProductLots(id) { return this.svc.getProductLots(id); }
    getValuationHistory(productId) {
        return this.valuation.getValuationHistory(productId);
    }
    // Reports
    getReportStockCurrent(q) { return this.svc.getStockCurrent(q); }
    getReportStockMovement(q) { return this.svc.getStockMovementReport(q); }
    getReportStockAging(q) { return this.svc.getStockAging(q); }
    getReportStockValuation(q) { return this.svc.getStockValuationReport(q); }
    getReportProductPerformance(q) { return this.svc.getProductPerformance(q); }
    // ─── Stock Transfers ───────────────────────────────────────────────────────
    getTransfers(q) { return this.svc.getTransfers(q); }
    getTransfer(id) { return this.svc.getTransfer(id); }
    createTransfer(dto) { return this.svc.createTransfer(dto); }
    confirmTransfer(id) { return this.svc.confirmTransfer(id); }
    // Aliases with simpler paths as requested
    getTransfersV2(q) { return this.svc.getTransfers(q); }
    getTransferV2(id) { return this.svc.getTransfer(id); }
    createTransferV2(dto) { return this.svc.createTransfer(dto); }
    updateTransferV2(id, dto) { return this.svc.updateTransfer(id, dto); }
    validateTransfer(id) { return this.svc.validateTransfer(id); }
    cancelTransfer(id) { return this.svc.cancelTransfer(id); }
    async getTransferPdf(id, q, res) {
        const out = await this.svc.generateTransferPdf(id);
        if (q && q.download === 'true') {
            const buf = Buffer.from(out.content, 'base64');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${out.filename}"`);
            return res.send(buf);
        }
        return out;
    }
    // ─── Stock Adjustments ─────────────────────────────────────────────────────
    getAdjustments(q) { return this.svc.getAdjustments(q); }
    getAdjustment(id) { return this.svc.getAdjustment(id); }
    createAdjustment(dto) { return this.svc.createAdjustment(dto); }
    validateAdjustment(id) { return this.svc.validateAdjustment(id); }
    // ─── Reorder Rules ─────────────────────────────────────────────────────────
    getReorderRules(q) { return this.svc.getReorderRules(q); }
    createReorderRule(dto) { return this.svc.createReorderRule(dto); }
    updateReorderRule(id, dto) { return this.svc.updateReorderRule(id, dto); }
    deleteReorderRule(id) { return this.svc.deleteReorderRule(id); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStats", null);
__decorate([
    Get('products'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProducts", null);
__decorate([
    Get('brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getBrands", null);
__decorate([
    Get('products/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProduct", null);
__decorate([
    Post('products'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createProduct", null);
__decorate([
    Put('products/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateProduct", null);
__decorate([
    Delete('products/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteProduct", null);
__decorate([
    Post('products/:id/stok'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateStok", null);
__decorate([
    Get('products/:id/variants'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getVariants", null);
__decorate([
    Post('products/:id/variants'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createVariant", null);
__decorate([
    Put('products/:id/variants/:variantId'),
    __param(0, Param('id')),
    __param(1, Param('variantId')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateVariant", null);
__decorate([
    Delete('products/:id/variants/:variantId'),
    __param(0, Param('id')),
    __param(1, Param('variantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteVariant", null);
__decorate([
    Get('products/:id/bundle-components'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getBundleComponents", null);
__decorate([
    Post('products/:id/bundle-components'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "addBundleComponent", null);
__decorate([
    Get('products/:id/tier-prices'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTierPrices", null);
__decorate([
    Post('products/:id/tier-prices'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "addTierPrice", null);
__decorate([
    Get('unit-conversions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getUnitConversions", null);
__decorate([
    Post('unit-conversions'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "addUnitConversion", null);
__decorate([
    Post('products/import'),
    UseInterceptors(FileInterceptor('file')),
    __param(0, UploadedFile()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "importProducts", null);
__decorate([
    Get('products/export'),
    __param(0, Query()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "exportProducts", null);
__decorate([
    Get('products/import-template'),
    __param(0, Res({ passthrough: true })),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "importTemplate", null);
__decorate([
    Get('stock-movements'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getMovements", null);
__decorate([
    Get('stock-opnames'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getOpnames", null);
__decorate([
    Post('stock-opnames'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createOpname", null);
__decorate([
    Post('stock-opnames/:id/validate'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "validateOpname", null);
__decorate([
    Get('stock-opnames/:id/export'),
    __param(0, Param('id')),
    __param(1, Query()),
    __param(2, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "exportOpname", null);
__decorate([
    Post('stock-opnames/:id/import'),
    UseInterceptors(FileInterceptor('file')),
    __param(0, Param('id')),
    __param(1, UploadedFile()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "importOpname", null);
__decorate([
    Get('warehouses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getWarehouses", null);
__decorate([
    Get('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getCategories", null);
__decorate([
    Get('units'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getUnits", null);
__decorate([
    Post('costing/fifo/calculate'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "calculateFIFO", null);
__decorate([
    Post('costing/fifo/commit'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "commitFIFO", null);
__decorate([
    Post('costing/average'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateAverageCost", null);
__decorate([
    Post('costing/revaluate'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "revaluate", null);
__decorate([
    Post('costing/lots'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createCostLot", null);
__decorate([
    Get('landed-costs'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLandedCosts", null);
__decorate([
    Get('landed-costs/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLandedCost", null);
__decorate([
    Post('landed-costs'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createLandedCost", null);
__decorate([
    Post('landed-costs/apply'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "applyLandedCosts", null);
__decorate([
    Post('landed-costs/:id/validate'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "validateLandedCost", null);
__decorate([
    Get('valuation/stats'),
    __param(0, Query('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getValuationStats", null);
__decorate([
    Get('valuation/stock'),
    __param(0, Query('date')),
    __param(1, Query('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStockValuation", null);
__decorate([
    Get('valuation/aging'),
    __param(0, Query('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStockAging", null);
__decorate([
    Get('valuation/slow-moving'),
    __param(0, Query('days')),
    __param(1, Query('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getSlowMoving", null);
__decorate([
    Get('valuation/lots'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStockLots", null);
__decorate([
    Get('lots'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLots", null);
__decorate([
    Get('lots/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getLot", null);
__decorate([
    Post('lots'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createLot", null);
__decorate([
    Get('lots/:id/trace'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "traceLot", null);
__decorate([
    Get('products/:id/lots'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getProductLots", null);
__decorate([
    Get('valuation/history/:productId'),
    __param(0, Param('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getValuationHistory", null);
__decorate([
    Get('reports/stock-current'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getReportStockCurrent", null);
__decorate([
    Get('reports/stock-movement'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getReportStockMovement", null);
__decorate([
    Get('reports/stock-aging'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getReportStockAging", null);
__decorate([
    Get('reports/stock-valuation'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getReportStockValuation", null);
__decorate([
    Get('reports/product-performance'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getReportProductPerformance", null);
__decorate([
    Get('stock-transfers'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTransfers", null);
__decorate([
    Get('stock-transfers/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTransfer", null);
__decorate([
    Post('stock-transfers'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createTransfer", null);
__decorate([
    Post('stock-transfers/:id/confirm'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "confirmTransfer", null);
__decorate([
    Get('transfers'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTransfersV2", null);
__decorate([
    Get('transfers/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTransferV2", null);
__decorate([
    Post('transfers'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createTransferV2", null);
__decorate([
    Put('transfers/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateTransferV2", null);
__decorate([
    Post('transfers/:id/validate'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "validateTransfer", null);
__decorate([
    Post('transfers/:id/cancel'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "cancelTransfer", null);
__decorate([
    Get('transfers/:id/pdf'),
    __param(0, Param('id')),
    __param(1, Query()),
    __param(2, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getTransferPdf", null);
__decorate([
    Get('stock-adjustments'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getAdjustments", null);
__decorate([
    Get('stock-adjustments/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getAdjustment", null);
__decorate([
    Post('stock-adjustments'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createAdjustment", null);
__decorate([
    Post('stock-adjustments/:id/validate'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "validateAdjustment", null);
__decorate([
    Get('reorder-rules'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getReorderRules", null);
__decorate([
    Post('reorder-rules'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createReorderRule", null);
__decorate([
    Put('reorder-rules/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "updateReorderRule", null);
__decorate([
    Delete('reorder-rules/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "deleteReorderRule", null);
InventoryController = __decorate([
    Controller('inventory'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(InventoryService)),
    __param(1, Inject(CostingService)),
    __param(2, Inject(LandedCostService)),
    __param(3, Inject(ValuationService)),
    __metadata("design:paramtypes", [InventoryService,
        CostingService,
        LandedCostService,
        ValuationService])
], InventoryController);
export { InventoryController };
