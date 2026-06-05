import { PrismaService } from '../../database/prisma.service.js';
export declare class TaxService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildDateFilter;
    getTaxSummary(query: any): Promise<{
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
    getEFakturs(query: any): Promise<{
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
    private quoteCsv;
    exportEFaktursCsv(query: any): Promise<{
        buffer: Buffer<ArrayBuffer>;
        filename: string;
    }>;
}
