import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller.js';
import { FinanceService } from './finance.service.js';
import { AccountService } from './account.service.js';
import { JournalService } from './journal.service.js';
import { LedgerService } from './ledger.service.js';
import { FinancialReportService } from './financial-report.service.js';
import { AutoJournalService } from './auto-journal.service.js';
import { ARAgingService } from './ar-aging.service.js';
import { APAgingService } from './ap-aging.service.js';
import { BudgetService } from './budget.service.js';
import { CreditLimitService } from './credit-limit.service.js';
import { PrismaService } from '../../database/prisma.service.js';

@Module({
  controllers: [FinanceController],
  providers: [
    FinanceService,
    AccountService,
    JournalService,
    LedgerService,
    FinancialReportService,
    AutoJournalService,
    ARAgingService,
    APAgingService,
    BudgetService,
    CreditLimitService,
    PrismaService,
  ],
  exports: [
    FinanceService,
    AccountService,
    JournalService,
    LedgerService,
    FinancialReportService,
    AutoJournalService,
    ARAgingService,
    APAgingService,
    BudgetService,
    CreditLimitService,
  ],
})
export class FinanceModule {}
