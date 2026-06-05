var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
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
import { JournalRecurringService } from './journal-recurring.service.js';
import { JournalRecurringCronService } from './journal-recurring-cron.service.js';
import { TaxService } from './tax.service.js';
import { PrismaService } from '../../database/prisma.service.js';
let FinanceModule = class FinanceModule {
};
FinanceModule = __decorate([
    Module({
        imports: [ScheduleModule],
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
            JournalRecurringService,
            JournalRecurringCronService,
            TaxService,
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
            JournalRecurringService,
            TaxService,
        ],
    })
], FinanceModule);
export { FinanceModule };
