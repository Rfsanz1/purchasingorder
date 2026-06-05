import { PrismaService } from '../../database/prisma.service.js';
export declare class APAgingService {
    private prisma;
    constructor(prisma: PrismaService);
    getAPAgingReport(asOfDate?: Date, branchId?: string): Promise<{
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
}
