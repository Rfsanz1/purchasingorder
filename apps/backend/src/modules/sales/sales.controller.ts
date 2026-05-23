import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(@Inject(SalesService) private readonly svc: SalesService) {}

  @Get('summary') getSummary(@Query() q: any) { return this.svc.getSalesSummary(q); }
  @Get('list') getSalesList() { return this.svc.getSalesList(); }
  @Get('orders') getOrders(@Query() q: any) { return this.svc.getOrders(q); }
  @Get('orders/:id') getOrder(@Param('id') id: string) { return this.svc.getOrder(Number(id)); }
  @Post('orders') createOrder(@Body() dto: any) { return this.svc.createOrder(dto); }
  @Put('orders/:id') updateOrder(@Param('id') id: string, @Body() dto: any) { return this.svc.updateOrder(Number(id), dto); }
  @Delete('orders/:id') deleteOrder(@Param('id') id: string) { return this.svc.deleteOrder(Number(id)); }
  @Get('faktur') getSales(@Query() q: any) { return this.svc.getSales(q); }
}
