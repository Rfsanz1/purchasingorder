import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { AccountService } from './account.service.js';
import { JournalService } from './journal.service.js';
import { LedgerService } from './ledger.service.js';
import { FinancialReportService } from './financial-report.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(
    @Inject(FinanceService) private readonly svc: FinanceService,
    @Inject(AccountService) private readonly accountSvc: AccountService,
    @Inject(JournalService) private readonly journalSvc: JournalService,
    @Inject(LedgerService) private readonly ledgerSvc: LedgerService,
    @Inject(FinancialReportService) private readonly reportSvc: FinancialReportService,
  ) {}

  // ─── Stats ────────────────────────────────────────────────────────────
  @Get('stats') getStats() { return this.svc.getStats(); }

  // ─── Legacy journal entries (ChartOfAccount) ─────────────────────────
  @Get('journal-entries') getJournals(@Query() q: any) { return this.svc.getJournalEntries(q); }
  @Post('journal-entries') createJournalEntry(@Body() dto: any) { return this.svc.createJournalEntry(dto); }

  // ─── Legacy COA ───────────────────────────────────────────────────────
  @Get('coa') getCoa(@Query() q: any) { return this.svc.getCoa(q); }
  @Post('coa') createCoa(@Body() dto: any) { return this.svc.createCoa(dto); }
  @Put('coa/:id') updateCoa(@Param('id') id: string, @Body() dto: any) { return this.svc.updateCoa(id, dto); }

  // ─── Bank & Cash ──────────────────────────────────────────────────────
  @Get('bank-accounts') getBankAccounts() { return this.svc.getBankAccounts(); }
  @Get('bank-transactions') getBankTx(@Query() q: any) { return this.svc.getBankTransactions(q); }
  @Post('bank-transactions') createBankTx(@Body() dto: any) { return this.svc.createBankTransaction(dto); }
  @Get('cash-transactions') getCashTx(@Query() q: any) { return this.svc.getCashTransactions(q); }
  @Post('cash-transactions') createCashTx(@Body() dto: any) { return this.svc.createCashTransaction(dto); }
  @Get('cash-flow') getCashFlow(@Query() q: any) { return this.svc.getCashFlow(q); }

  // ─── Accounts (Chart of Accounts — double entry) ─────────────────────
  @Get('accounts') getAccounts(@Query() q: any) { return this.accountSvc.findAll(q); }
  @Get('accounts/tree') getAccountTree() { return this.accountSvc.getTree(); }
  @Get('accounts/:id') getAccount(@Param('id') id: string) { return this.accountSvc.findOne(id); }
  @Post('accounts') createAccount(@Body() dto: any) { return this.accountSvc.create(dto); }
  @Put('accounts/:id') updateAccount(@Param('id') id: string, @Body() dto: any) { return this.accountSvc.update(id, dto); }
  @Delete('accounts/:id') removeAccount(@Param('id') id: string) { return this.accountSvc.remove(id); }

  // ─── Journals (double entry) ──────────────────────────────────────────
  @Get('journals') getJournalList(@Query() q: any) { return this.journalSvc.findAll(q); }
  @Get('journals/:id') getJournal(@Param('id') id: string) { return this.journalSvc.findOne(id); }
  @Post('journals') createJournal(@Body() dto: any) { return this.journalSvc.createJournal(dto); }
  @Post('journals/:id/post') postJournal(@Param('id') id: string) { return this.journalSvc.postJournal(id); }
  @Post('journals/:id/cancel') cancelJournal(@Param('id') id: string) { return this.journalSvc.cancelJournal(id); }
  @Post('journals/:id/reverse') reverseJournal(@Param('id') id: string) { return this.journalSvc.reverseJournal(id); }

  // ─── Ledger ───────────────────────────────────────────────────────────
  @Get('ledger/:accountId') getGeneralLedger(
    @Param('accountId') accountId: string,
    @Query() q: any,
  ) { return this.ledgerSvc.getGeneralLedger(accountId, q.dateFrom, q.dateTo); }

  @Get('trial-balance') getTrialBalance(@Query() q: any) {
    return this.ledgerSvc.getTrialBalance(q.dateFrom, q.dateTo);
  }

  // ─── Financial Reports ────────────────────────────────────────────────
  @Get('reports/balance-sheet') getBalanceSheet(@Query() q: any) {
    return this.reportSvc.getBalanceSheet(q.date);
  }
  @Get('reports/income-statement') getIncomeStatement(@Query() q: any) {
    return this.reportSvc.getIncomeStatement(q.dateFrom, q.dateTo);
  }
  @Get('reports/cash-flow') getCashFlowReport(@Query() q: any) {
    return this.reportSvc.getCashFlow(q.dateFrom, q.dateTo);
  }
}
