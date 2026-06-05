import { StreamableFile } from '@nestjs/common';
import { Response } from 'express';
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
export declare class FinanceController {
    private readonly svc;
    private readonly accountSvc;
    private readonly journalSvc;
    private readonly ledgerSvc;
    private readonly reportSvc;
    private readonly arAgingSvc;
    private readonly apAgingSvc;
    private readonly budgetSvc;
    private readonly creditSvc;
    private readonly recurringSvc;
    private readonly taxSvc;
    constructor(svc: FinanceService, accountSvc: AccountService, journalSvc: JournalService, ledgerSvc: LedgerService, reportSvc: FinancialReportService, arAgingSvc: ARAgingService, apAgingSvc: APAgingService, budgetSvc: BudgetService, creditSvc: CreditLimitService, recurringSvc: JournalRecurringService, taxSvc: TaxService);
    getStats(): Promise<{
        totalJurnals: number;
        totalBankBalance: number | import("@prisma/client/runtime/library").Decimal;
        cashIn: number | import("@prisma/client/runtime/library").Decimal;
        cashOut: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getJournals(q: any): Promise<{
        data: ({
            lines: ({
                coa: {
                    id: string;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    type: string;
                    code: string;
                    parentId: string | null;
                };
            } & {
                id: string;
                debit: import("@prisma/client/runtime/library").Decimal;
                kredit: import("@prisma/client/runtime/library").Decimal;
                keterangan: string | null;
                journalEntryId: string;
                coaId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            tanggal: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            referenceId: string | null;
            noJurnal: string;
            keterangan: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createJournalEntry(dto: any): Promise<{
        lines: {
            id: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            journalEntryId: string;
            coaId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        tanggal: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        referenceId: string | null;
        noJurnal: string;
        keterangan: string | null;
    }>;
    getCoa(q: any): Promise<({
        children: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            code: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        code: string;
        parentId: string | null;
    })[]>;
    createCoa(dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        code: string;
        parentId: string | null;
    }>;
    updateCoa(id: string, dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        code: string;
        parentId: string | null;
    }>;
    getBankAccounts(): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        bankName: string;
        accountNo: string;
        accountName: string;
        balance: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    getBankTx(q: any): Promise<{
        data: ({
            bankAccount: {
                id: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                bankName: string;
                accountNo: string;
                accountName: string;
                balance: import("@prisma/client/runtime/library").Decimal;
            };
            coa: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                code: string;
                parentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            type: string;
            tanggal: Date;
            referenceId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            coaId: string | null;
            bankAccountId: string;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createBankTx(dto: any): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        tanggal: Date;
        referenceId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        keterangan: string | null;
        coaId: string | null;
        bankAccountId: string;
    }>;
    createBankReceive(dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: string;
            tanggal: Date;
            referenceId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            coaId: string | null;
            bankAccountId: string;
        };
        message: string;
    }>;
    createBankPayment(dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: string;
            tanggal: Date;
            referenceId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            coaId: string | null;
            bankAccountId: string;
        };
        message: string;
    }>;
    transferBankFunds(dto: any): Promise<{
        data: {
            debit: {
                id: string;
                createdAt: Date;
                type: string;
                tanggal: Date;
                referenceId: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                keterangan: string | null;
                coaId: string | null;
                bankAccountId: string;
            };
            credit: {
                id: string;
                createdAt: Date;
                type: string;
                tanggal: Date;
                referenceId: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                keterangan: string | null;
                coaId: string | null;
                bankAccountId: string;
            };
        };
        message: string;
    }>;
    getCashTx(q: any): Promise<{
        data: ({
            coa: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                code: string;
                parentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            type: string;
            tanggal: Date;
            referenceId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            coaId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createCashTx(dto: any): Promise<{
        id: string;
        createdAt: Date;
        type: string;
        tanggal: Date;
        referenceId: string | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        keterangan: string | null;
        coaId: string | null;
    }>;
    createCashReceive(dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: string;
            tanggal: Date;
            referenceId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            coaId: string | null;
        };
        message: string;
    }>;
    createCashPayment(dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: string;
            tanggal: Date;
            referenceId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            coaId: string | null;
        };
        message: string;
    }>;
    getMoneyTransactions(q: any): Promise<{
        data: ({
            coa: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                code: string;
                parentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            type: string;
            tanggal: Date;
            referenceId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            coaId: string | null;
        })[];
        message: string;
        meta: {
            bank: any;
            cash: any;
        };
    }>;
    getCashFlow(q: any): Promise<{
        totalMasuk: number | import("@prisma/client/runtime/library").Decimal;
        totalKeluar: number | import("@prisma/client/runtime/library").Decimal;
        saldo: number;
    }>;
    getAccounts(q: any): Promise<({
        parent: {
            id: string;
            name: string;
            code: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.AccountType;
        code: string;
        parentId: string | null;
        isActive: boolean;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        normalBalance: string;
    })[]>;
    getAccountTree(): Promise<any[]>;
    getAccount(id: string): Promise<{
        parent: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            type: import("@prisma/client").$Enums.AccountType;
            code: string;
            parentId: string | null;
            isActive: boolean;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            normalBalance: string;
        };
        children: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            type: import("@prisma/client").$Enums.AccountType;
            code: string;
            parentId: string | null;
            isActive: boolean;
            openingBalance: import("@prisma/client/runtime/library").Decimal;
            normalBalance: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.AccountType;
        code: string;
        parentId: string | null;
        isActive: boolean;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        normalBalance: string;
    }>;
    createAccount(dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.AccountType;
        code: string;
        parentId: string | null;
        isActive: boolean;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        normalBalance: string;
    }>;
    updateAccount(id: string, dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.AccountType;
        code: string;
        parentId: string | null;
        isActive: boolean;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        normalBalance: string;
    }>;
    removeAccount(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        type: import("@prisma/client").$Enums.AccountType;
        code: string;
        parentId: string | null;
        isActive: boolean;
        openingBalance: import("@prisma/client/runtime/library").Decimal;
        normalBalance: string;
    }>;
    getJournalList(q: any): Promise<{
        data: ({
            lines: ({
                account: {
                    id: string;
                    name: string;
                    code: string;
                };
            } & {
                id: string;
                createdAt: Date;
                deskripsi: string | null;
                journalId: string;
                accountId: string;
                debit: import("@prisma/client/runtime/library").Decimal;
                kredit: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            status: import("@prisma/client").$Enums.JournalStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            referensi: string | null;
            deskripsi: string | null;
            nomor: string;
            tanggal: Date;
            createdById: string | null;
            reversalOf: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getJournal(id: string): Promise<{
        lines: ({
            account: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                code: string;
                parentId: string | null;
                isActive: boolean;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                normalBalance: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string | null;
            journalId: string;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    createJournal(dto: any): Promise<{
        lines: ({
            account: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                code: string;
                parentId: string | null;
                isActive: boolean;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                normalBalance: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string | null;
            journalId: string;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    postJournal(id: string): Promise<{
        lines: ({
            account: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                code: string;
                parentId: string | null;
                isActive: boolean;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                normalBalance: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string | null;
            journalId: string;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    cancelJournal(id: string): Promise<{
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    reverseJournal(id: string): Promise<{
        lines: ({
            account: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                code: string;
                parentId: string | null;
                isActive: boolean;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                normalBalance: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string | null;
            journalId: string;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    getGeneralLedger(accountId: string, q: any): Promise<{
        account: {
            id: string;
            code: string;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
        };
        period: {
            dateFrom: string;
            dateTo: string;
        };
        openingBalance: number;
        lines: {
            date: Date;
            nomor: string;
            deskripsi: string;
            debit: number;
            kredit: number;
            balance: number;
        }[];
        totalDebit: number;
        totalKredit: number;
        closingBalance: number;
    }>;
    getTrialBalance(q: any): Promise<{
        period: {
            dateFrom: string;
            dateTo: string;
        };
        accounts: {
            accountId: string;
            code: string;
            name: string;
            type: import("@prisma/client").$Enums.AccountType;
            normalBalance: string;
            totalDebit: number;
            totalKredit: number;
            balance: number;
            debitBalance: number;
            creditBalance: number;
        }[];
        totals: {
            totalDebit: number;
            totalKredit: number;
            totalDebitBalance: number;
            totalCreditBalance: number;
        };
    }>;
    getBalanceSheet(q: any): Promise<{
        date: string;
        assets: {
            items: {
                id: any;
                code: any;
                name: any;
                type: any;
                balance: number;
            }[];
            total: number;
        };
        liabilities: {
            items: {
                id: any;
                code: any;
                name: any;
                type: any;
                balance: number;
            }[];
            total: number;
        };
        equity: {
            items: {
                id: any;
                code: any;
                name: any;
                type: any;
                balance: number;
            }[];
            total: number;
        };
        totalLiabilitiesAndEquity: number;
        isBalanced: boolean;
    }>;
    getIncomeStatement(q: any): Promise<any>;
    getCashFlowReport(q: any): Promise<{
        period: {
            dateFrom: string;
            dateTo: string;
        };
        operating: {
            netIncome: any;
            adjustments: {
                perubahanPiutang: number;
                perubahanPersediaan: number;
                perubahanHutangDagang: number;
            };
            total: number;
        };
        investing: {
            perubahanAsetTetap: number;
            total: number;
        };
        financing: {
            perubahanHutangBank: number;
            total: number;
        };
        netCashFlow: number;
    }>;
    getEquityStatement(q: any): Promise<{
        period: {
            dateFrom: string;
            dateTo: string;
        };
        equity: {
            items: {
                id: any;
                code: any;
                name: any;
                type: any;
                balance: number;
            }[];
            total: number;
        };
        netIncome: any;
        beginningEquity: number;
        endingEquity: number;
    }>;
    getExecutiveSummary(q: any): Promise<{
        period: {
            dateFrom: string;
            dateTo: string;
        };
        balanceSheet: {
            date: string;
            assets: {
                items: {
                    id: any;
                    code: any;
                    name: any;
                    type: any;
                    balance: number;
                }[];
                total: number;
            };
            liabilities: {
                items: {
                    id: any;
                    code: any;
                    name: any;
                    type: any;
                    balance: number;
                }[];
                total: number;
            };
            equity: {
                items: {
                    id: any;
                    code: any;
                    name: any;
                    type: any;
                    balance: number;
                }[];
                total: number;
            };
            totalLiabilitiesAndEquity: number;
            isBalanced: boolean;
        };
        incomeStatement: any;
        cashFlow: {
            period: {
                dateFrom: string;
                dateTo: string;
            };
            operating: {
                netIncome: any;
                adjustments: {
                    perubahanPiutang: number;
                    perubahanPersediaan: number;
                    perubahanHutangDagang: number;
                };
                total: number;
            };
            investing: {
                perubahanAsetTetap: number;
                total: number;
            };
            financing: {
                perubahanHutangBank: number;
                total: number;
            };
            netCashFlow: number;
        };
        metrics: {
            totalAssets: number;
            totalLiabilities: number;
            totalEquity: number;
            netIncome: any;
            cashFlow: number;
        };
    }>;
    getTaxSummary(q: any): Promise<{
        period: {
            dateFrom: any;
            dateTo: any;
        };
        totals: {
            totalCollected: number;
            totalPaid: number;
            netTax: number;
        };
        details: any[];
    }>;
    getEfakturs(q: any): Promise<{
        data: ({
            tax: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                accountId: string | null;
                nama: string;
                tipe: import("@prisma/client").$Enums.TaxType;
                kode: string;
                rate: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            status: import("@prisma/client").$Enums.EFakturStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            referenceId: string | null;
            taxId: string | null;
            npwpPembeli: string | null;
            namaPembeli: string | null;
            nomorFaktur: string;
            nilaiDPP: import("@prisma/client/runtime/library").Decimal;
            nilaiPPN: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    exportEfakturs(q: any, res: Response): Promise<StreamableFile>;
    exportReport(q: any, res: Response): Promise<StreamableFile>;
    getARAgingReport(q: any): Promise<{
        asOf: Date;
        rows: {
            creditExceeded: boolean;
            creditWarning: boolean;
            customerId: string;
            customerName: string;
            creditLimit: number;
            creditUsed: number;
            buckets: import("./ar-aging.service.js").AgingBucket;
            totalOutstanding: number;
            invoices: any[];
        }[];
        grandTotal: import("./ar-aging.service.js").AgingBucket & {
            total: number;
        };
    }>;
    getAPAgingReport(q: any): Promise<{
        asOf: Date;
        rows: {
            supplierId: string;
            supplierName: string;
            buckets: {
                current: number;
                d30: number;
                d60: number;
                d90: number;
                over90: number;
            };
            totalOutstanding: number;
            upcomingPayments: {
                noPo: string;
                amount: number;
                dueDate: Date;
                daysUntilDue: number;
            }[];
        }[];
        grandTotal: {
            current: number;
            d30: number;
            d60: number;
            d90: number;
            over90: number;
            total: number;
        };
    }>;
    getCreditLimits(q: any): Promise<{
        data: {
            available: number;
            pctUsed: number;
            isExceeded: boolean;
            isWarning: boolean;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            kledoId: string | null;
            phone: string | null;
            city: string | null;
            province: string | null;
            npwp: string | null;
            creditLimit: import("@prisma/client/runtime/library").Decimal;
            creditUsed: import("@prisma/client/runtime/library").Decimal;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    setCreditLimit(id: string, dto: {
        creditLimit: number;
    }): Promise<{
        id: string;
        email: string | null;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        address: string | null;
        kledoId: string | null;
        phone: string | null;
        city: string | null;
        province: string | null;
        npwp: string | null;
        creditLimit: import("@prisma/client/runtime/library").Decimal;
        creditUsed: import("@prisma/client/runtime/library").Decimal;
    }>;
    checkCredit(id: string, dto: {
        amount: number;
    }): Promise<{
        customerId: string;
        customerName: string;
        creditLimit: number;
        used: number;
        newOrderAmount: number;
        projectedTotal: number;
        available: number;
        isExceeded: boolean;
        warningAt80Pct: boolean;
    }>;
    setBulkCreditLimit(dto: {
        items: {
            customerId: string;
            creditLimit: number;
        }[];
    }): Promise<{
        updated: number;
    }>;
    getRecurringJournals(q: any): Promise<{
        data: ({
            lines: {
                id: string;
                deskripsi: string | null;
                accountId: string;
                debit: import("@prisma/client/runtime/library").Decimal;
                kredit: import("@prisma/client/runtime/library").Decimal;
                journalRecurringId: string;
            }[];
        } & {
            status: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            createdById: string | null;
            journalId: string | null;
            startDate: Date;
            endDate: Date | null;
            frequency: string;
            interval: number;
            nextRunAt: Date;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getRecurringJournal(id: string): Promise<{
        lines: {
            id: string;
            deskripsi: string | null;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
            journalRecurringId: string;
        }[];
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        journalId: string | null;
        startDate: Date;
        endDate: Date | null;
        frequency: string;
        interval: number;
        nextRunAt: Date;
    }>;
    createRecurringJournal(dto: any): Promise<{
        lines: {
            id: string;
            deskripsi: string | null;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
            journalRecurringId: string;
        }[];
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        journalId: string | null;
        startDate: Date;
        endDate: Date | null;
        frequency: string;
        interval: number;
        nextRunAt: Date;
    }>;
    updateRecurringJournal(id: string, dto: any): Promise<{
        lines: {
            id: string;
            deskripsi: string | null;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
            journalRecurringId: string;
        }[];
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        journalId: string | null;
        startDate: Date;
        endDate: Date | null;
        frequency: string;
        interval: number;
        nextRunAt: Date;
    }>;
    deleteRecurringJournal(id: string): Promise<{
        message: string;
    }>;
    runRecurringJournal(id: string): Promise<{
        message: string;
        results?: undefined;
    } | {
        message: string;
        results: any[];
    }>;
    runDueRecurringJournals(): Promise<{
        message: string;
        results?: undefined;
    } | {
        message: string;
        results: any[];
    }>;
    getBudgets(q: any): Promise<{
        data: ({
            _count: {
                lines: number;
            };
        } & {
            status: import("@prisma/client").$Enums.BudgetStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            nama: string;
            fiscalYearId: string | null;
            departemenId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getBudget(id: string): Promise<{
        lines: {
            id: string;
            accountId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            bulan: number;
            budgetId: string;
        }[];
    } & {
        status: import("@prisma/client").$Enums.BudgetStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        nama: string;
        fiscalYearId: string | null;
        departemenId: string | null;
    }>;
    createBudget(dto: any): Promise<{
        lines: {
            id: string;
            accountId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            bulan: number;
            budgetId: string;
        }[];
    } & {
        status: import("@prisma/client").$Enums.BudgetStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        nama: string;
        fiscalYearId: string | null;
        departemenId: string | null;
    }>;
    updateBudget(id: string, dto: any): Promise<{
        lines: {
            id: string;
            accountId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            bulan: number;
            budgetId: string;
        }[];
    } & {
        status: import("@prisma/client").$Enums.BudgetStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        nama: string;
        fiscalYearId: string | null;
        departemenId: string | null;
    }>;
    approveBudget(id: string): Promise<{
        status: import("@prisma/client").$Enums.BudgetStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        nama: string;
        fiscalYearId: string | null;
        departemenId: string | null;
    }>;
    getBudgetVsActual(id: string): Promise<{
        budget: {
            lines: {
                id: string;
                accountId: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                bulan: number;
                budgetId: string;
            }[];
        } & {
            status: import("@prisma/client").$Enums.BudgetStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            nama: string;
            fiscalYearId: string | null;
            departemenId: string | null;
        };
        rows: any[];
    }>;
    checkBudget(dto: {
        accountId: string;
        amount: number;
        bulan: number;
        tahun: number;
    }): Promise<{
        budgeted: number;
        used: number;
        remaining: number;
        isExceeded: boolean;
        requestedAmount: number;
    }>;
    getAssets(q: any): {
        redirect: string;
        q: any;
    };
    createBankAccount(dto: any): Promise<{
        data: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            bankName: string;
            accountNo: string;
            accountName: string;
            balance: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    updateBankAccount(id: string, dto: any): Promise<{
        data: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            bankName: string;
            accountNo: string;
            accountName: string;
            balance: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    deleteBankAccount(id: string): Promise<{
        data: any;
        message: string;
    }>;
    sendMoney(dto: any): Promise<{
        data: {
            data: {
                id: string;
                createdAt: Date;
                type: string;
                tanggal: Date;
                referenceId: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                keterangan: string | null;
                coaId: string | null;
            };
            message: string;
        };
        message: string;
    }>;
    receiveMoney(dto: any): Promise<{
        data: {
            data: {
                id: string;
                createdAt: Date;
                type: string;
                tanggal: Date;
                referenceId: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                keterangan: string | null;
                coaId: string | null;
            };
            message: string;
        };
        message: string;
    }>;
    getReconciliations(q: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            selisih: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            bankAccountId: string;
            periodeAwal: Date;
            periodeAkhir: Date;
            saldoBuku: import("@prisma/client/runtime/library").Decimal;
            saldoBank: import("@prisma/client/runtime/library").Decimal;
        }[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getReconciliation(id: string): Promise<{
        data: {
            transactions: {
                id: string;
                createdAt: Date;
                type: string;
                tanggal: Date;
                referenceId: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                keterangan: string | null;
                coaId: string | null;
                bankAccountId: string;
            }[];
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            selisih: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            bankAccountId: string;
            periodeAwal: Date;
            periodeAkhir: Date;
            saldoBuku: import("@prisma/client/runtime/library").Decimal;
            saldoBank: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    getReconciliationByAccount(accountId: string): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            selisih: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            bankAccountId: string;
            periodeAwal: Date;
            periodeAkhir: Date;
            saldoBuku: import("@prisma/client/runtime/library").Decimal;
            saldoBank: import("@prisma/client/runtime/library").Decimal;
        }[];
        message: string;
    }>;
    createReconciliation(dto: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            selisih: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            bankAccountId: string;
            periodeAwal: Date;
            periodeAkhir: Date;
            saldoBuku: import("@prisma/client/runtime/library").Decimal;
            saldoBank: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    updateReconciliation(id: string, dto: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            selisih: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            bankAccountId: string;
            periodeAwal: Date;
            periodeAkhir: Date;
            saldoBuku: import("@prisma/client/runtime/library").Decimal;
            saldoBank: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    importBankCsv(dto: any): Promise<{
        data: any[];
        message: string;
        recon?: undefined;
    } | {
        data: any[];
        recon: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            selisih: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            bankAccountId: string;
            periodeAwal: Date;
            periodeAkhir: Date;
            saldoBuku: import("@prisma/client/runtime/library").Decimal;
            saldoBank: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    matchBankTransaction(id: string, dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: string;
            tanggal: Date;
            referenceId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            keterangan: string | null;
            coaId: string | null;
            bankAccountId: string;
        };
        message: string;
    }>;
    autoMatchBankReconciliation(id: string): Promise<{
        data: any[];
        message: string;
    }>;
    completeBankReconciliation(id: string): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            selisih: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            bankAccountId: string;
            periodeAwal: Date;
            periodeAkhir: Date;
            saldoBuku: import("@prisma/client/runtime/library").Decimal;
            saldoBank: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    deleteCoa(id: string): Promise<{
        data: any;
        message: string;
    }>;
    getProfitLoss(q: any): Promise<any>;
    getProfitLossPdf(q: any, res: Response): Promise<StreamableFile>;
    getProfitLossExcel(q: any, res: Response): Promise<StreamableFile>;
}
