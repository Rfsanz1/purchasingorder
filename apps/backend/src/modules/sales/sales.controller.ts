import { Controller, Get, Post, Put, Delete, Patch, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CanAccessGuard } from '../../common/guards/can-access.guard.js';
import { CanAccess } from '../../common/decorators/can-access.decorator.js';

@Controller('sales')
@UseGuards(JwtAuthGuard, CanAccessGuard)
@CanAccess({ roles: ['Super Admin', 'Owner', 'Admin', 'Sales'] })
export class SalesController {
  constructor(@Inject(SalesService) private readonly svc: SalesService) {}

  @Get('summary') getSummary(@Query() q: any) { return this.svc.getSalesSummary(q); }
  @Get('list') getSalesList() { return this.svc.getSalesList(); }
  @Get('orders') getOrders(@Query() q: any) { return this.svc.getOrders(q); }
  @Get('orders/:id') getOrder(@Param('id') id: string) { return this.svc.getOrder(Number(id)); }
  @Post('orders') createOrder(@Body() dto: any) { return this.svc.createOrder(dto); }
  @Put('orders/:id') updateOrder(@Param('id') id: string, @Body() dto: any) { return this.svc.updateOrder(Number(id), dto); }
  @Delete('orders/:id') deleteOrder(@Param('id') id: string) { return this.svc.deleteOrder(Number(id)); }
  @Patch('orders/:id/pengiriman') updatePengiriman(@Param('id') id: string, @Body() dto: any) { return this.svc.updatePengiriman(Number(id), dto); }
  @Post('orders/:id/bukti-transfer') uploadBukti(@Param('id') id: string, @Body('base64') base64: string) { return this.svc.uploadBuktiTransfer(Number(id), base64); }
  @Post('orders/:id/whatsapp') sendWa(@Param('id') id: string, @Body() dto: any) { return this.svc.sendWhatsAppNotification({ ...dto, id }); }
  @Get('faktur') getSales(@Query() q: any) { return this.svc.getSales(q); }

  @Get('customer-location/:token')
  getCustomerLoc(@Param('token') token: string) { return this.svc.getCustomerLocation(token); }

  @Post('customer-location/:token')
  saveCustomerLoc(@Param('token') token: string, @Body() dto: { lat: string; lng: string }) {
    return this.svc.saveCustomerLocation(token, dto.lat, dto.lng);
  }

  // ─── Quotations ──────────────────────────────────────────────────────────
  @Get('quotations')             getQuotations(@Query() q: any)                                   { return this.svc.getQuotations(q); }
  @Get('quotations/:id')         getQuotation(@Param('id') id: string)                            { return this.svc.getQuotation(id); }
  @Post('quotations')            createQuotation(@Body() dto: any)                                { return this.svc.createQuotation(dto); }
  @Put('quotations/:id')         updateQuotation(@Param('id') id: string, @Body() dto: any)      { return this.svc.updateQuotation(id, dto); }
  @Delete('quotations/:id')      deleteQuotation(@Param('id') id: string)                        { return this.svc.deleteQuotation(id); }
  @Post('quotations/:id/convert-to-order')
  convertQuotation(@Param('id') id: string) { return this.svc.convertQuotationToOrder(id); }

  // ─── Sales Returns ───────────────────────────────────────────────────────
  @Get('returns')                getSalesReturns(@Query() q: any)                                 { return this.svc.getSalesReturns(q); }
  @Get('returns/:id')            getSalesReturn(@Param('id') id: string)                         { return this.svc.getSalesReturn(id); }
  @Post('returns')               createSalesReturn(@Body() dto: any)                             { return this.svc.createSalesReturn(dto); }

  // ─── Pricelists ──────────────────────────────────────────────────────────
  @Get('pricelists')             getPricelists(@Query() q: any)                                   { return this.svc.getPricelists(q); }
  @Get('pricelists/:id')         getPricelist(@Param('id') id: string)                           { return this.svc.getPricelist(id); }
  @Post('pricelists')            createPricelist(@Body() dto: any)                               { return this.svc.createPricelist(dto); }
  @Put('pricelists/:id')         updatePricelist(@Param('id') id: string, @Body() dto: any)     { return this.svc.updatePricelist(id, dto); }
  @Delete('pricelists/:id')      deletePricelist(@Param('id') id: string)                       { return this.svc.deletePricelist(id); }
}
