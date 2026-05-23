import { Controller, Get, Post, Put, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { PosService } from './pos.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('pos')
export class PosController {
  constructor(@Inject(PosService) private readonly svc: PosService) {}

  @Post('auth/login') login(@Body() dto: any) { return this.svc.login(dto.username, dto.password); }

  @Get('dashboard') @UseGuards(JwtAuthGuard) getDashboard() { return this.svc.getDashboard(); }
  @Get('products') getProducts(@Query() q: any) { return this.svc.getProducts(q); }
  @Post('products') @UseGuards(JwtAuthGuard) createProduct(@Body() dto: any) { return this.svc.createProduct(dto); }
  @Put('products/:id') @UseGuards(JwtAuthGuard) updateProduct(@Param('id') id: string, @Body() dto: any) { return this.svc.updateProduct(id, dto); }
  @Get('categories') getCategories() { return this.svc.getCategories(); }
  @Get('sales') @UseGuards(JwtAuthGuard) getSales(@Query() q: any) { return this.svc.getSales(q); }
  @Post('sales') createSale(@Body() dto: any) { return this.svc.createSale(dto); }
}
