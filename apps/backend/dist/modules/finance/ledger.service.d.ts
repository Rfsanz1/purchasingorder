import { PrismaService } from '../../database/prisma.service.js';
export declare class LedgerService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getGeneralLedger(accountId: string, dateFrom?: string, dateTo?: string): Promise<{
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
    getTrialBalance(dateFrom?: string, dateTo?: string): Promise<{
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
}
