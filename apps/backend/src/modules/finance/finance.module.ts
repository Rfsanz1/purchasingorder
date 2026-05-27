import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller.js';
import { FinanceService } from './finance.service.js';
import { AccountService } from './account.service.js';
import { JournalService } from './journal.service.js';
import { LedgerService } from './ledger.service.js';
import { FinancialReportService } from './financial-report.service.js';
import { AutoJournalService } from './auto-journal.service.js';
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
    PrismaService,
  ],
  exports: [
    FinanceService,
    AccountService,
    JournalService,
    LedgerService,
    FinancialReportService,
    AutoJournalService,
  ],
})
export class FinanceModule {}
