import { PrismaService } from '../../database/prisma.service.js';
import { CostingService } from './costing.service.js';
import { LandedCostSplitMethod } from '@prisma/client';
interface LandedCostInput {
    deskripsi: string;
    amount: number;
    splitMethod: LandedCostSplitMethod;
}
export declare class LandedCostService {
    private prisma;
    private costing;
    constructor(prisma: PrismaService, costing: CostingService);
    findAll(query: any): Promise<{
        data: ({
            items: ({
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
                landedCostId: string;
                alokasiBiaya: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deskripsi: string;
            purchaseId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            splitMethod: import("@prisma/client").$Enums.LandedCostSplitMethod;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        items: ({
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
            landedCostId: string;
            alokasiBiaya: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deskripsi: string;
        purchaseId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        splitMethod: import("@prisma/client").$Enums.LandedCostSplitMethod;
    }>;
    applyLandedCost(purchaseId: string, costs: LandedCostInput[]): Promise<any[]>;
    createDraft(data: {
        purchaseId: string;
        deskripsi: string;
        amount: number;
        splitMethod: LandedCostSplitMethod;
    }): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deskripsi: string;
        purchaseId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        splitMethod: import("@prisma/client").$Enums.LandedCostSplitMethod;
    }>;
    validate(id: string): Promise<any[]>;
}
export {};
