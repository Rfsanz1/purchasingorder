import { PrismaService } from '../../database/prisma.service.js';
export declare class CreditLimitService {
    private prisma;
    constructor(prisma: PrismaService);
    getCreditLimits(query: any): Promise<{
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
    checkCreditLimit(customerId: string, newOrderAmount: number): Promise<{
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
    updateCreditUsed(customerId: string): Promise<{
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
    setCreditLimit(customerId: string, creditLimit: number): Promise<{
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
    setBulkCreditLimit(items: {
        customerId: string;
        creditLimit: number;
    }[]): Promise<{
        updated: number;
    }>;
    private recalcCreditUsed;
}
