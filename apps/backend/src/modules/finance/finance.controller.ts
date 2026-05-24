import { Controller, Get, Post, Put, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(@Inject(FinanceService) private readonly svc: FinanceService) {}

  @Get('stats') getStats() { return this.svc.getStats(); }
  @Get('journal-entries') getJournals(@Query() q: any) { return this.svc.getJournalEntries(q); }
  @Post('journal-entries') createJournal(@Body() dto: any) { return this.svc.createJournalEntry(dto); }
  @Get('coa') getCoa(@Query() q: any) { return this.svc.getCoa(q); }
  @Post('coa') createCoa(@Body() dto: any) { return this.svc.createCoa(dto); }
  @Put('coa/:id') updateCoa(@Param('id') id: string, @Body() dto: any) { return this.svc.updateCoa(id, dto); }
  @Get('bank-accounts') getBankAccounts() { return this.svc.getBankAccounts(); }
  @Get('bank-transactions') getBankTx(@Query() q: any) { return this.svc.getBankTransactions(q); }
  @Post('bank-transactions') createBankTx(@Body() dto: any) { return this.svc.createBankTransaction(dto); }
  @Get('cash-transactions') getCashTx(@Query() q: any) { return this.svc.getCashTransactions(q); }
  @Post('cash-transactions') createCashTx(@Body() dto: any) { return this.svc.createCashTransaction(dto); }
  @Get('cash-flow') getCashFlow(@Query() q: any) { return this.svc.getCashFlow(q); }
}
