import { PrismaService } from '../../database/prisma.service.js';
export interface AgingBucket {
    current: number;
    d30: number;
    d60: number;
    d90: number;
    over90: number;
}
export declare class ARAgingService {
    private prisma;
    constructor(prisma: PrismaService);
    getARAgingReport(asOfDate?: Date, branchId?: string): Promise<{
        asOf: Date;
        rows: {
            creditExceeded: boolean;
            creditWarning: boolean;
            customerId: string;
            customerName: string;
            creditLimit: number;
            creditUsed: number;
            buckets: AgingBucket;
            totalOutstanding: number;
            invoices: any[];
        }[];
        grandTotal: AgingBucket & {
            total: number;
        };
    }>;
}
