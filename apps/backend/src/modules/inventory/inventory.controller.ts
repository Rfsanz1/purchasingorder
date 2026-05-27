import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { CostingService } from './costing.service.js';
import { LandedCostService } from './landed-cost.service.js';
import { ValuationService } from './valuation.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(
    @Inject(InventoryService) private readonly svc: InventoryService,
    @Inject(CostingService) private readonly costing: CostingService,
    @Inject(LandedCostService) private readonly landedCost: LandedCostService,
    @Inject(ValuationService) private readonly valuation: ValuationService,
  ) {}

  // ─── EXISTING ROUTES (tidak diubah) ───────────────────────────────────────
  @Get('stats') getStats() { return this.svc.getStats(); }
  @Get('products') getProducts(@Query() q: any) { return this.svc.getProducts(q); }
  @Get('brands') getBrands() { return this.svc.getBrands(); }
  @Get('products/:id') getProduct(@Param('id') id: string) { return this.svc.getProduct(id); }
  @Post('products') createProduct(@Body() dto: any) { return this.svc.createProduct(dto); }
  @Put('products/:id') updateProduct(@Param('id') id: string, @Body() dto: any) { return this.svc.updateProduct(id, dto); }
  @Delete('products/:id') deleteProduct(@Param('id') id: string) { return this.svc.deleteProduct(id); }
  @Post('products/:id/stok') updateStok(
    @Param('id') id: string,
    @Body() dto: { qty: number; type: 'in' | 'out'; note?: string },
  ) { return this.svc.updateStok(id, dto.qty, dto.type, dto.note); }
  @Get('stock-movements') getMovements(@Query() q: any) { return this.svc.getStockMovements(q); }
  @Get('stock-opnames') getOpnames(@Query() q: any) { return this.svc.getStockOpnames(q); }
  @Post('stock-opnames') createOpname(@Body() dto: any) { return this.svc.createStockOpname(dto); }
  @Get('warehouses') getWarehouses() { return this.svc.getWarehouses(); }
  @Get('categories') getCategories() { return this.svc.getCategories(); }
  @Get('units') getUnits() { return this.svc.getUnits(); }

  // ─── COSTING ROUTES ───────────────────────────────────────────────────────
  @Post('costing/fifo/calculate')
  calculateFIFO(@Body() dto: { productId: string; qty: number }) {
    return this.costing.calculateFIFO(dto.productId, dto.qty);
  }

  @Post('costing/fifo/commit')
  commitFIFO(@Body() dto: { productId: string; qty: number; referenceId?: string }) {
    return this.costing.commitFIFO(dto.productId, dto.qty, dto.referenceId);
  }

  @Post('costing/average')
  updateAverageCost(@Body() dto: { productId: string; qtyMasuk: number; unitCost: number }) {
    return this.costing.calculateAverageCost(dto.productId, dto.qtyMasuk, dto.unitCost);
  }

  @Post('costing/revaluate')
  revaluate(@Body() dto: { productId: string; newCost: number; note?: string }) {
    return this.costing.revaluateStock(dto.productId, dto.newCost, dto.note);
  }

  @Post('costing/lots')
  createLot(@Body() dto: {
    productId: string; nomorLot: string; qtyAwal: number;
    unitCost: number; expiryDate?: string; referenceId?: string;
  }) {
    return this.costing.createLot({
      ...dto,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
    });
  }

  // ─── LANDED COST ROUTES ───────────────────────────────────────────────────
  @Get('landed-costs')
  getLandedCosts(@Query() q: any) {
    return this.landedCost.findAll(q);
  }

  @Get('landed-costs/:id')
  getLandedCost(@Param('id') id: string) {
    return this.landedCost.findOne(id);
  }

  @Post('landed-costs')
  createLandedCost(@Body() dto: {
    purchaseId: string; deskripsi: string;
    amount: number; splitMethod: any;
  }) {
    return this.landedCost.createDraft(dto);
  }

  @Post('landed-costs/apply')
  applyLandedCosts(@Body() dto: {
    purchaseId: string;
    costs: { deskripsi: string; amount: number; splitMethod: any }[];
  }) {
    return this.landedCost.applyLandedCost(dto.purchaseId, dto.costs);
  }

  @Post('landed-costs/:id/validate')
  validateLandedCost(@Param('id') id: string) {
    return this.landedCost.validate(id);
  }

  // ─── VALUATION ROUTES ─────────────────────────────────────────────────────
  @Get('valuation/stats')
  getValuationStats(@Query('warehouseId') warehouseId?: string) {
    return this.valuation.getValuationStats(warehouseId);
  }

  @Get('valuation/stock')
  getStockValuation(
    @Query('date') date?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.valuation.getStockValuation(date ? new Date(date) : undefined, warehouseId);
  }

  @Get('valuation/aging')
  getStockAging(@Query('warehouseId') warehouseId?: string) {
    return this.valuation.getStockAgingReport(warehouseId);
  }

  @Get('valuation/slow-moving')
  getSlowMoving(
    @Query('days') days?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    return this.valuation.getSlowMovingItems(days ? Number(days) : 90, warehouseId);
  }

  @Get('valuation/lots')
  getStockLots(@Query() q: any) {
    return this.valuation.getStockLots(q);
  }

  @Get('valuation/history/:productId')
  getValuationHistory(@Param('productId') productId: string) {
    return this.valuation.getValuationHistory(productId);
  }
}
