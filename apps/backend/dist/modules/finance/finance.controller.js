var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards, Res, StreamableFile } from '@nestjs/common';
import { FinanceService } from './finance.service.js';
import { AccountService } from './account.service.js';
import { JournalService } from './journal.service.js';
import { LedgerService } from './ledger.service.js';
import { FinancialReportService } from './financial-report.service.js';
import { ARAgingService } from './ar-aging.service.js';
import { APAgingService } from './ap-aging.service.js';
import { BudgetService } from './budget.service.js';
import { CreditLimitService } from './credit-limit.service.js';
import { JournalRecurringService } from './journal-recurring.service.js';
import { TaxService } from './tax.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let FinanceController = class FinanceController {
    svc;
    accountSvc;
    journalSvc;
    ledgerSvc;
    reportSvc;
    arAgingSvc;
    apAgingSvc;
    budgetSvc;
    creditSvc;
    recurringSvc;
    taxSvc;
    constructor(svc, accountSvc, journalSvc, ledgerSvc, reportSvc, arAgingSvc, apAgingSvc, budgetSvc, creditSvc, recurringSvc, taxSvc) {
        this.svc = svc;
        this.accountSvc = accountSvc;
        this.journalSvc = journalSvc;
        this.ledgerSvc = ledgerSvc;
        this.reportSvc = reportSvc;
        this.arAgingSvc = arAgingSvc;
        this.apAgingSvc = apAgingSvc;
        this.budgetSvc = budgetSvc;
        this.creditSvc = creditSvc;
        this.recurringSvc = recurringSvc;
        this.taxSvc = taxSvc;
    }
    // ─── Stats ────────────────────────────────────────────────────────────
    getStats() { return this.svc.getStats(); }
    // ─── Legacy journal entries (ChartOfAccount) ─────────────────────────
    getJournals(q) { return this.svc.getJournalEntries(q); }
    createJournalEntry(dto) { return this.svc.createJournalEntry(dto); }
    // ─── Legacy COA ───────────────────────────────────────────────────────
    getCoa(q) { return this.svc.getCoa(q); }
    createCoa(dto) { return this.svc.createCoa(dto); }
    updateCoa(id, dto) { return this.svc.updateCoa(id, dto); }
    // ─── Bank & Cash ──────────────────────────────────────────────────────
    getBankAccounts() { return this.svc.getBankAccounts(); }
    getBankTx(q) { return this.svc.getBankTransactions(q); }
    createBankTx(dto) { return this.svc.createBankTransaction(dto); }
    createBankReceive(dto) { return this.svc.createBankReceive(dto); }
    createBankPayment(dto) { return this.svc.createBankPayment(dto); }
    transferBankFunds(dto) { return this.svc.transferBankFunds(dto); }
    getCashTx(q) { return this.svc.getCashTransactions(q); }
    createCashTx(dto) { return this.svc.createCashTransaction(dto); }
    createCashReceive(dto) { return this.svc.createCashReceive(dto); }
    createCashPayment(dto) { return this.svc.createCashPayment(dto); }
    getMoneyTransactions(q) { return this.svc.getMoneyTransactions(q); }
    getCashFlow(q) { return this.svc.getCashFlow(q); }
    // ─── Accounts (Chart of Accounts — double entry) ─────────────────────
    getAccounts(q) { return this.accountSvc.findAll(q); }
    getAccountTree() { return this.accountSvc.getTree(); }
    getAccount(id) { return this.accountSvc.findOne(id); }
    createAccount(dto) { return this.accountSvc.create(dto); }
    updateAccount(id, dto) { return this.accountSvc.update(id, dto); }
    removeAccount(id) { return this.accountSvc.remove(id); }
    // ─── Journals (double entry) ──────────────────────────────────────────
    getJournalList(q) { return this.journalSvc.findAll(q); }
    getJournal(id) { return this.journalSvc.findOne(id); }
    createJournal(dto) { return this.journalSvc.createJournal(dto); }
    postJournal(id) { return this.journalSvc.postJournal(id); }
    cancelJournal(id) { return this.journalSvc.cancelJournal(id); }
    reverseJournal(id) { return this.journalSvc.reverseJournal(id); }
    // ─── Ledger ───────────────────────────────────────────────────────────
    getGeneralLedger(accountId, q) {
        return this.ledgerSvc.getGeneralLedger(accountId, q.dateFrom, q.dateTo);
    }
    getTrialBalance(q) {
        return this.ledgerSvc.getTrialBalance(q.dateFrom, q.dateTo);
    }
    // ─── Financial Reports ────────────────────────────────────────────────
    getBalanceSheet(q) { return this.reportSvc.getBalanceSheet(q.asOf || q.date); }
    getIncomeStatement(q) { return this.reportSvc.getIncomeStatement(q.startDate || q.dateFrom, q.endDate || q.dateTo, q.compare === 'true' || q.compare === true); }
    getCashFlowReport(q) { return this.reportSvc.getCashFlow(q.startDate || q.dateFrom, q.endDate || q.dateTo); }
    getEquityStatement(q) { return this.reportSvc.getStatementOfEquity(q.startDate || q.dateFrom, q.endDate || q.dateTo); }
    getExecutiveSummary(q) { return this.reportSvc.getExecutiveSummary(q.startDate || q.dateFrom, q.endDate || q.dateTo); }
    getTaxSummary(q) { return this.taxSvc.getTaxSummary(q); }
    getEfakturs(q) { return this.taxSvc.getEFakturs(q); }
    async exportEfakturs(q, res) {
        const { buffer, filename } = await this.taxSvc.exportEFaktursCsv(q);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return new StreamableFile(Buffer.from(buffer));
    }
    async exportReport(q, res) {
        const compare = q.compare === 'true' || q.compare === true;
        const { buffer, filename, contentType } = await this.reportSvc.exportReport(q.type, q.format, q.date, q.dateFrom, q.dateTo, compare);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return new StreamableFile(Buffer.from(buffer));
    }
    // ─── AR/AP Aging ─────────────────────────────────────────────────────
    getARAgingReport(q) { return this.arAgingSvc.getARAgingReport(q.asOf ? new Date(q.asOf) : undefined, q.branchId); }
    getAPAgingReport(q) { return this.apAgingSvc.getAPAgingReport(q.asOf ? new Date(q.asOf) : undefined, q.branchId); }
    // ─── Credit Limit ─────────────────────────────────────────────────────
    getCreditLimits(q) { return this.creditSvc.getCreditLimits(q); }
    setCreditLimit(id, dto) {
        return this.creditSvc.setCreditLimit(id, dto.creditLimit);
    }
    checkCredit(id, dto) {
        return this.creditSvc.checkCreditLimit(id, dto.amount);
    }
    setBulkCreditLimit(dto) {
        return this.creditSvc.setBulkCreditLimit(dto.items);
    }
    // ─── Recurring Journals ───────────────────────────────────────────────
    getRecurringJournals(q) { return this.recurringSvc.findAll(q); }
    getRecurringJournal(id) { return this.recurringSvc.findOne(id); }
    createRecurringJournal(dto) { return this.recurringSvc.create(dto); }
    updateRecurringJournal(id, dto) { return this.recurringSvc.update(id, dto); }
    deleteRecurringJournal(id) { return this.recurringSvc.remove(id); }
    runRecurringJournal(id) { return this.recurringSvc.runDueRecurring(id); }
    runDueRecurringJournals() { return this.recurringSvc.runDueRecurring(); }
    // ─── Budget ───────────────────────────────────────────────────────────
    getBudgets(q) { return this.budgetSvc.getBudgets(q); }
    getBudget(id) { return this.budgetSvc.getBudget(id); }
    createBudget(dto) { return this.budgetSvc.createBudget(dto); }
    updateBudget(id, dto) { return this.budgetSvc.updateBudget(id, dto); }
    approveBudget(id) { return this.budgetSvc.approveBudget(id); }
    getBudgetVsActual(id) { return this.budgetSvc.getBudgetVsActual(id); }
    checkBudget(dto) {
        return this.budgetSvc.checkBudgetAvailability(dto.accountId, dto.amount, dto.bulan, dto.tahun);
    }
    // ─── Fixed Assets ─────────────────────────────────────────────────────
    getAssets(q) { return { redirect: '/api/assets', q }; }
    // ─── Bank Account CRUD ─────────────────────────────────────────────────
    createBankAccount(dto) { return this.svc.createBankAccount(dto); }
    updateBankAccount(id, dto) { return this.svc.updateBankAccount(id, dto); }
    deleteBankAccount(id) { return this.svc.deleteBankAccount(id); }
    sendMoney(dto) { return this.svc.sendMoney(dto); }
    receiveMoney(dto) { return this.svc.receiveMoney(dto); }
    // ─── Bank Reconciliation ───────────────────────────────────────────────
    getReconciliations(q) { return this.svc.getBankReconciliations(q); }
    getReconciliation(id) { return this.svc.getBankReconciliation(id); }
    getReconciliationByAccount(accountId) { return this.svc.getBankReconciliationsByAccount(accountId); }
    createReconciliation(dto) { return this.svc.createBankReconciliation(dto); }
    updateReconciliation(id, dto) { return this.svc.updateBankReconciliation(id, dto); }
    importBankCsv(dto) { return this.svc.importBankCsv(dto); }
    matchBankTransaction(id, dto) { return this.svc.matchBankTransaction(id, dto); }
    autoMatchBankReconciliation(id) { return this.svc.autoMatchBankReconciliation(id); }
    completeBankReconciliation(id) { return this.svc.completeBankReconciliation(id); }
    // ─── COA delete ────────────────────────────────────────────────────────
    deleteCoa(id) { return this.svc.deleteCoa(id); }
    // ─── Profit & Loss alias ───────────────────────────────────────────────
    getProfitLoss(q) { return this.reportSvc.getIncomeStatement(q.dateFrom, q.dateTo, q.compare === 'true' || q.compare === true); }
    async getProfitLossPdf(q, res) {
        const { buffer, filename, contentType } = await this.reportSvc.exportReport('profit-loss', 'pdf', undefined, q.dateFrom, q.dateTo);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return new StreamableFile(Buffer.from(buffer));
    }
    async getProfitLossExcel(q, res) {
        const { buffer, filename, contentType } = await this.reportSvc.exportReport('profit-loss', 'xlsx', undefined, q.dateFrom, q.dateTo);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return new StreamableFile(Buffer.from(buffer));
    }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getStats", null);
__decorate([
    Get('journal-entries'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getJournals", null);
__decorate([
    Post('journal-entries'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createJournalEntry", null);
__decorate([
    Get('coa'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getCoa", null);
__decorate([
    Post('coa'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createCoa", null);
__decorate([
    Put('coa/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateCoa", null);
__decorate([
    Get('bank-accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getBankAccounts", null);
__decorate([
    Get('bank-transactions'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getBankTx", null);
__decorate([
    Post('bank-transactions'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createBankTx", null);
__decorate([
    Post('bank-transactions/receive'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createBankReceive", null);
__decorate([
    Post('bank-transactions/payment'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createBankPayment", null);
__decorate([
    Post('bank-transactions/transfer'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "transferBankFunds", null);
__decorate([
    Get('cash-transactions'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getCashTx", null);
__decorate([
    Post('cash-transactions'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createCashTx", null);
__decorate([
    Post('cash-transactions/receive'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createCashReceive", null);
__decorate([
    Post('cash-transactions/payment'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createCashPayment", null);
__decorate([
    Get('money-transactions'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getMoneyTransactions", null);
__decorate([
    Get('cash-flow'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getCashFlow", null);
__decorate([
    Get('accounts'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getAccounts", null);
__decorate([
    Get('accounts/tree'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getAccountTree", null);
__decorate([
    Get('accounts/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getAccount", null);
__decorate([
    Post('accounts'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createAccount", null);
__decorate([
    Put('accounts/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateAccount", null);
__decorate([
    Delete('accounts/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "removeAccount", null);
__decorate([
    Get('journals'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getJournalList", null);
__decorate([
    Get('journals/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getJournal", null);
__decorate([
    Post('journals'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createJournal", null);
__decorate([
    Post('journals/:id/post'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "postJournal", null);
__decorate([
    Post('journals/:id/cancel'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "cancelJournal", null);
__decorate([
    Post('journals/:id/reverse'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "reverseJournal", null);
__decorate([
    Get('ledger/:accountId'),
    __param(0, Param('accountId')),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getGeneralLedger", null);
__decorate([
    Get('trial-balance'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getTrialBalance", null);
__decorate([
    Get('reports/balance-sheet'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getBalanceSheet", null);
__decorate([
    Get('reports/income-statement'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getIncomeStatement", null);
__decorate([
    Get('reports/cash-flow'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getCashFlowReport", null);
__decorate([
    Get('reports/equity-statement'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getEquityStatement", null);
__decorate([
    Get('reports/executive-summary'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getExecutiveSummary", null);
__decorate([
    Get('reports/tax-summary'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getTaxSummary", null);
__decorate([
    Get('reports/efakturs'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getEfakturs", null);
__decorate([
    Get('reports/efakturs/export'),
    __param(0, Query()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "exportEfakturs", null);
__decorate([
    Get('reports/export'),
    __param(0, Query()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "exportReport", null);
__decorate([
    Get('ar-aging'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getARAgingReport", null);
__decorate([
    Get('ap-aging'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getAPAgingReport", null);
__decorate([
    Get('credit-limits'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getCreditLimits", null);
__decorate([
    Post('credit-limits/:customerId/set'),
    __param(0, Param('customerId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "setCreditLimit", null);
__decorate([
    Post('credit-limits/:customerId/check'),
    __param(0, Param('customerId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "checkCredit", null);
__decorate([
    Post('credit-limits/bulk'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "setBulkCreditLimit", null);
__decorate([
    Get('journals/recurring'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getRecurringJournals", null);
__decorate([
    Get('journals/recurring/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getRecurringJournal", null);
__decorate([
    Post('journals/recurring'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createRecurringJournal", null);
__decorate([
    Put('journals/recurring/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateRecurringJournal", null);
__decorate([
    Delete('journals/recurring/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteRecurringJournal", null);
__decorate([
    Post('journals/recurring/:id/run'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "runRecurringJournal", null);
__decorate([
    Post('journals/recurring/run'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "runDueRecurringJournals", null);
__decorate([
    Get('budgets'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getBudgets", null);
__decorate([
    Get('budgets/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getBudget", null);
__decorate([
    Post('budgets'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createBudget", null);
__decorate([
    Put('budgets/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateBudget", null);
__decorate([
    Post('budgets/:id/approve'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "approveBudget", null);
__decorate([
    Get('budgets/:id/vs-actual'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getBudgetVsActual", null);
__decorate([
    Post('budgets/check-availability'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "checkBudget", null);
__decorate([
    Get('fixed-assets'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getAssets", null);
__decorate([
    Post('bank-accounts'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createBankAccount", null);
__decorate([
    Put('bank-accounts/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateBankAccount", null);
__decorate([
    Delete('bank-accounts/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteBankAccount", null);
__decorate([
    Post('send-money'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "sendMoney", null);
__decorate([
    Post('receive-money'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "receiveMoney", null);
__decorate([
    Get('bank-reconciliations'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getReconciliations", null);
__decorate([
    Get('bank-reconciliations/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getReconciliation", null);
__decorate([
    Get('bank-reconciliation/:accountId'),
    __param(0, Param('accountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getReconciliationByAccount", null);
__decorate([
    Post('bank-reconciliations'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createReconciliation", null);
__decorate([
    Put('bank-reconciliations/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateReconciliation", null);
__decorate([
    Post('bank-reconciliations/import-csv'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "importBankCsv", null);
__decorate([
    Post('bank-reconciliations/:id/match'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "matchBankTransaction", null);
__decorate([
    Post('bank-reconciliations/:id/auto-match'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "autoMatchBankReconciliation", null);
__decorate([
    Post('bank-reconciliations/:id/complete'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "completeBankReconciliation", null);
__decorate([
    Delete('coa/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteCoa", null);
__decorate([
    Get('reports/profit-loss'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getProfitLoss", null);
__decorate([
    Get('reports/profit-loss/pdf'),
    __param(0, Query()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getProfitLossPdf", null);
__decorate([
    Get('reports/profit-loss/excel'),
    __param(0, Query()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getProfitLossExcel", null);
FinanceController = __decorate([
    Controller('finance'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(FinanceService)),
    __param(1, Inject(AccountService)),
    __param(2, Inject(JournalService)),
    __param(3, Inject(LedgerService)),
    __param(4, Inject(FinancialReportService)),
    __param(5, Inject(ARAgingService)),
    __param(6, Inject(APAgingService)),
    __param(7, Inject(BudgetService)),
    __param(8, Inject(CreditLimitService)),
    __param(9, Inject(JournalRecurringService)),
    __param(10, Inject(TaxService)),
    __metadata("design:paramtypes", [FinanceService,
        AccountService,
        JournalService,
        LedgerService,
        FinancialReportService,
        ARAgingService,
        APAgingService,
        BudgetService,
        CreditLimitService,
        JournalRecurringService,
        TaxService])
], FinanceController);
export { FinanceController };
