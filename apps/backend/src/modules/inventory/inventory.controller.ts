import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(@Inject(InventoryService) private readonly svc: InventoryService) {}

  @Get('stats') getStats() { return this.svc.getStats(); }
  @Get('products') getProducts(@Query() q: any) { return this.svc.getProducts(q); }
  @Get('products/:id') getProduct(@Param('id') id: string) { return this.svc.getProduct(id); }
  @Post('products') createProduct(@Body() dto: any) { return this.svc.createProduct(dto); }
  @Put('products/:id') updateProduct(@Param('id') id: string, @Body() dto: any) { return this.svc.updateProduct(id, dto); }
  @Delete('products/:id') deleteProduct(@Param('id') id: string) { return this.svc.deleteProduct(id); }
  @Get('stock-movements') getMovements(@Query() q: any) { return this.svc.getStockMovements(q); }
  @Get('stock-opnames') getOpnames(@Query() q: any) { return this.svc.getStockOpnames(q); }
  @Post('stock-opnames') createOpname(@Body() dto: any) { return this.svc.createStockOpname(dto); }
  @Get('warehouses') getWarehouses() { return this.svc.getWarehouses(); }
  @Get('categories') getCategories() { return this.svc.getCategories(); }
  @Get('units') getUnits() { return this.svc.getUnits(); }
}
