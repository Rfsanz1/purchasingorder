import { Controller, Get, Put, Post, Delete, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(@Inject(SettingsService) private readonly svc: SettingsService) {}

  @Get()                getAll()                                            { return this.svc.getAll(); }
  @Put()                update(@Body() dto: Record<string, string>)         { return this.svc.update(dto); }

  @Get('document-numbers')
  getDocumentNumbers() { return this.svc.getDocumentNumbers(); }

  @Put('document-numbers/:module')
  updateDocumentNumber(@Param('module') module: string, @Body() dto: any) {
    return this.svc.updateDocumentNumber(module, dto);
  }

  @Get('smtp')
  getSmtp() { return this.svc.getSmtp(); }

  @Put('smtp')
  updateSmtp(@Body() dto: any) { return this.svc.updateSmtp(dto); }

  @Post('smtp/test')
  testSmtp(@Body() dto: { to: string }) { return this.svc.testSmtp(dto.to); }

  @Get('fiscal-year')
  getFiscalYear() { return this.svc.getFiscalYear(); }

  @Put('fiscal-year')
  updateFiscalYear(@Body() dto: { startMonth: number; startYear: number }) {
    return this.svc.updateFiscalYear(dto);
  }
}
