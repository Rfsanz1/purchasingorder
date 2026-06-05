import { PrismaService } from '../../database/prisma.service.js';
export interface StockValuationRow {
    productId: string;
    sku: string;
    name: string;
    warehouse?: string;
    category?: string;
    stok: number;
    unitCost: number;
    totalValue: number;
    costingMethod: string;
}
export interface StockAgingRow {
    productId: string;
    sku: string;
    name: string;
    nomorLot: string;
    qtyAwal: number;
    qtySisa: number;
    unitCost: number;
    totalValue: number;
    ageDays: number;
    expiryDate?: Date;
    expiredIn?: number;
    ageCategory: 'fresh' | 'normal' | 'slow' | 'critical';
}
export declare class ValuationService {
    private prisma;
    constructor(prisma: PrismaService);
    getStockValuation(date?: Date, warehouseId?: string): Promise<{
        asOf: Date;
        totalValue: number;
        rows: StockValuationRow[];
    }>;
    getStockAgingReport(warehouseId?: string): Promise<StockAgingRow[]>;
    getSlowMovingItems(days?: number, warehouseId?: string): Promise<{
        productId: string;
        sku: string;
        name: string;
        category: string;
        warehouse: string;
        stok: number;
        unitCost: number;
        totalValue: number;
        daysSinceMovement: number;
        costingMethod: import("@prisma/client").$Enums.CostingMethod;
    }[]>;
    getStockLots(query: any): Promise<{
        data: ({
            product: {
                warehouse: {
                    id: string;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    address: string | null;
                };
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    parentId: string | null;
                };
            } & {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sku: string;
                categoryId: string | null;
                warehouseId: string | null;
                brand: string | null;
                unitId: string | null;
                hargaBeli: import("@prisma/client/runtime/library").Decimal;
                hargaJual: import("@prisma/client/runtime/library").Decimal;
                hargaKledo: import("@prisma/client/runtime/library").Decimal;
                stok: number;
                stokMinimum: number;
                costingMethod: import("@prisma/client").$Enums.CostingMethod;
                standardCost: import("@prisma/client/runtime/library").Decimal;
                currentAvgCost: import("@prisma/client/runtime/library").Decimal;
                kledoProductId: string | null;
                isSpmBrand: boolean;
                imageUrl: string | null;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getValuationHistory(productId: string): Promise<({
        product: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            sku: string;
            categoryId: string | null;
            warehouseId: string | null;
            brand: string | null;
            unitId: string | null;
            hargaBeli: import("@prisma/client/runtime/library").Decimal;
            hargaJual: import("@prisma/client/runtime/library").Decimal;
            hargaKledo: import("@prisma/client/runtime/library").Decimal;
            stok: number;
            stokMinimum: number;
            costingMethod: import("@prisma/client").$Enums.CostingMethod;
            standardCost: import("@prisma/client/runtime/library").Decimal;
            currentAvgCost: import("@prisma/client/runtime/library").Decimal;
            kledoProductId: string | null;
            isSpmBrand: boolean;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        referenceId: string | null;
        unitCost: import("@prisma/client/runtime/library").Decimal;
        date: Date;
        totalValue: import("@prisma/client/runtime/library").Decimal;
        movementType: string;
    })[]>;
    getValuationStats(warehouseId?: string): Promise<{
        totalInventoryValue: number;
        totalProducts: number;
        criticalLots: number;
        slowLots: number;
        totalLots: number;
        asOf: Date;
    }>;
}
