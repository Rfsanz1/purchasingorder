import { PrismaService } from '../../database/prisma.service.js';
export interface FIFOResult {
    totalCOGS: number;
    avgUnitCost: number;
    lotsConsumed: {
        nomorLot: string;
        qty: number;
        unitCost: number;
        amount: number;
    }[];
    remainingQty: number;
}
export declare class CostingService {
    private prisma;
    constructor(prisma: PrismaService);
    calculateFIFO(productId: string, qtyKeluar: number): Promise<FIFOResult>;
    commitFIFO(productId: string, qtyKeluar: number, referenceId?: string): Promise<FIFOResult>;
    calculateAverageCost(productId: string, qtyMasuk: number, unitCost: number): Promise<{
        previousAvgCost: number;
        newAvgCost: number;
        newQty: number;
    }>;
    revaluateStock(productId: string, newCost: number, note?: string): Promise<{
        productId: string;
        oldCost: number;
        newCost: number;
        qty: number;
        adjustmentValue: number;
        message: string;
    }>;
    createLot(data: {
        productId: string;
        nomorLot: string;
        qtyAwal: number;
        unitCost: number;
        expiryDate?: Date;
        referenceId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        referenceId: string | null;
        nomorLot: string;
        expiryDate: Date | null;
        qtyAwal: import("@prisma/client/runtime/library").Decimal;
        qtySisa: import("@prisma/client/runtime/library").Decimal;
        unitCost: import("@prisma/client/runtime/library").Decimal;
    }>;
    createValuationEntry(productId: string, qty: number, unitCost: number, movementType: string, referenceId?: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        referenceId: string | null;
        unitCost: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        totalValue: import("@prisma/client/runtime/library").Decimal;
        movementType: string;
    }>;
    createAutoJournal(type: 'GRN' | 'DELIVERY' | 'OPNAME_PLUS' | 'OPNAME_MINUS' | 'LANDED_COST' | 'REVALUATION', productId: string, qty: number, unitCost: number, referenceId?: string): Promise<{
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
    private createRevaluationJournal;
    private getAccountCodes;
}
