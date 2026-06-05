import { PrismaService } from '../../database/prisma.service.js';
import { AutoJournalService } from './auto-journal.service.js';
export declare class FinanceService {
    private readonly prisma;
    private readonly autoJournal;
    constructor(prisma: PrismaService, autoJournal: AutoJournalService);
    getJournalEntries(query: any): Promise<{
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
    getCoa(query: any): Promise<({
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
    getBankTransactions(query: any): Promise<{
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
    createBankTransaction(dto: any): Promise<{
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
    getCashTransactions(query: any): Promise<{
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
    createCashTransaction(dto: any): Promise<{
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
    getCashFlow(query: any): Promise<{
        totalMasuk: number | import("@prisma/client/runtime/library").Decimal;
        totalKeluar: number | import("@prisma/client/runtime/library").Decimal;
        saldo: number;
    }>;
    getStats(): Promise<{
        totalJurnals: number;
        totalBankBalance: number | import("@prisma/client/runtime/library").Decimal;
        cashIn: number | import("@prisma/client/runtime/library").Decimal;
        cashOut: number | import("@prisma/client/runtime/library").Decimal;
    }>;
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
    getMoneyTransactions(query: any): Promise<{
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
    getBankReconciliations(query: any): Promise<{
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
    getBankReconciliation(id: string): Promise<{
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
    getBankReconciliationsByAccount(accountId: string): Promise<{
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
    createBankReconciliation(dto: any): Promise<{
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
    updateBankReconciliation(id: string, dto: any): Promise<{
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
    private parseAmount;
    private tryParseDate;
    importBankCsv(dto: {
        bankAccountId: string;
        csv: string;
        periodeAwal?: string;
        periodeAkhir?: string;
        saldoBuku?: number;
        saldoBank?: number;
        notes?: string;
    }): Promise<{
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
    matchBankTransaction(reconId: string, dto: {
        transactionId: string;
        coaId?: string;
    }): Promise<{
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
    autoMatchBankReconciliation(reconId: string): Promise<{
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
}
