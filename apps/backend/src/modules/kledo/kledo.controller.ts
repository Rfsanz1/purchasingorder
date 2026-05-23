import { Controller, Get, Post, Query, Inject, UseGuards } from '@nestjs/common';
import { KledoService } from './kledo.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('kledo')
export class KledoController {
  constructor(@Inject(KledoService) private readonly svc: KledoService) {}

  @Get('status') getStatus() { return this.svc.getStatus(); }
  @Get('products') @UseGuards(JwtAuthGuard) getProducts(@Query() q: any) { return this.svc.getProducts(q); }
  @Get('contacts') @UseGuards(JwtAuthGuard) getContacts(@Query() q: any) { return this.svc.getContacts(q); }
  @Get('invoices') @UseGuards(JwtAuthGuard) getInvoices(@Query() q: any) { return this.svc.getInvoices(q); }
  @Get('spm-brands') getSpmBrands() { return this.svc.getSpmBrands(); }
  @Post('sync') @UseGuards(JwtAuthGuard) syncNow() { return this.svc.syncNow(); }
  @Get('sync-logs') @UseGuards(JwtAuthGuard) getSyncLogs(@Query() q: any) { return this.svc.getSyncLogs(q); }
}
