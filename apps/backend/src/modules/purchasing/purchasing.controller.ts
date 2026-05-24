import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { PurchasingService } from './purchasing.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@Controller('purchasing')
@UseGuards(JwtAuthGuard)
export class PurchasingController {
  constructor(@Inject(PurchasingService) private readonly svc: PurchasingService) {}

  @Get('stats') getStats() { return this.svc.getStats(); }
  @Get('purchase-orders') getPOs(@Query() q: any) { return this.svc.getPurchaseOrders(q); }
  @Get('purchase-orders/:id') getPO(@Param('id') id: string) { return this.svc.getPurchaseOrder(id); }
  @Post('purchase-orders') createPO(@Body() dto: any) { return this.svc.createPurchaseOrder(dto); }
  @Put('purchase-orders/:id') updatePO(@Param('id') id: string, @Body() dto: any) { return this.svc.updatePurchaseOrder(id, dto); }
  @Post('purchase-orders/:id/approve') approvePO(@Param('id') id: string, @CurrentUser() user: any) { return this.svc.approvePurchaseOrder(id, user?.sub ?? 'system'); }
  @Post('purchase-orders/:id/cancel') cancelPO(@Param('id') id: string) { return this.svc.cancelPurchaseOrder(id); }
  @Patch('purchase-orders/:id/status') changeStatus(@Param('id') id: string, @Body('status') status: string) { return this.svc.changeStatus(id, status); }
  @Get('goods-receipts') getGRs(@Query() q: any) { return this.svc.getGoodsReceipts(q); }
  @Post('goods-receipts') createGR(@Body() dto: any) { return this.svc.createGoodsReceipt(dto); }
  @Get('suppliers') getSuppliers(@Query() q: any) { return this.svc.getSuppliers(q); }
  @Post('suppliers') createSupplier(@Body() dto: any) { return this.svc.createSupplier(dto); }
  @Put('suppliers/:id') updateSupplier(@Param('id') id: string, @Body() dto: any) { return this.svc.updateSupplier(id, dto); }
  @Delete('suppliers/:id') deleteSupplier(@Param('id') id: string) { return this.svc.deleteSupplier(id); }
}
