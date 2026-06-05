import { PrismaService } from '../../database/prisma.service.js';
export declare class BudgetService {
    private prisma;
    constructor(prisma: PrismaService);
    getBudgets(query: any): Promise<{
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
    getBudgetVsActual(budgetId: string): Promise<{
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
    checkBudgetAvailability(accountId: string, amount: number, bulan: number, tahun: number): Promise<{
        budgeted: number;
        used: number;
        remaining: number;
        isExceeded: boolean;
        requestedAmount: number;
    }>;
}
