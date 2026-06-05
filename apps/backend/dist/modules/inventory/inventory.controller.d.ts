import { Response } from 'express';
import { InventoryService } from './inventory.service.js';
import { CostingService } from './costing.service.js';
import { LandedCostService } from './landed-cost.service.js';
import { ValuationService } from './valuation.service.js';
export declare class InventoryController {
    private readonly svc;
    private readonly costing;
    private readonly landedCost;
    private readonly valuation;
    constructor(svc: InventoryService, costing: CostingService, landedCost: LandedCostService, valuation: ValuationService);
    getStats(): Promise<{
        totalProducts: number;
        lowStock: number;
        totalStok: number;
    }>;
    getProducts(q: any): Promise<{
        data: ({
            warehouse: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
            };
            unit: {
                symbol: string;
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getBrands(): Promise<string[]>;
    getProduct(id: string): Promise<{
        warehouse: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
        };
        unit: {
            symbol: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            parentId: string | null;
        };
        stockMovements: {
            id: string;
            createdAt: Date;
            type: string;
            productId: string;
            note: string | null;
            warehouseId: string | null;
            qty: number;
            referenceId: string | null;
        }[];
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
    }>;
    createProduct(dto: any): Promise<{
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
    }>;
    updateProduct(id: string, dto: any): Promise<{
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
    }>;
    deleteProduct(id: string): Promise<{
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
    }>;
    updateStok(id: string, dto: {
        qty: number;
        type: 'in' | 'out';
        note?: string;
    }): Promise<{
        stok: number;
    }>;
    getVariants(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal | null;
        stock: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        barcode: string | null;
    }[]>;
    createVariant(id: string, dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal | null;
        stock: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        barcode: string | null;
    }>;
    updateVariant(id: string, variantId: string, dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal | null;
        stock: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        barcode: string | null;
    }>;
    deleteVariant(id: string, variantId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        sku: string;
        price: import("@prisma/client/runtime/library").Decimal | null;
        stock: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        attributes: import("@prisma/client/runtime/library").JsonValue;
        barcode: string | null;
    }>;
    getBundleComponents(id: string): Promise<({
        component: {
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
        componentId: string;
    })[]>;
    addBundleComponent(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        componentId: string;
    }>;
    getTierPrices(id: string): Promise<{
        id: string;
        createdAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        minQty: import("@prisma/client/runtime/library").Decimal;
        maxQty: import("@prisma/client/runtime/library").Decimal | null;
        currency: string;
    }[]>;
    addTierPrice(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        minQty: import("@prisma/client/runtime/library").Decimal;
        maxQty: import("@prisma/client/runtime/library").Decimal | null;
        currency: string;
    }>;
    getUnitConversions(): Promise<{
        id: string;
        createdAt: Date;
        fromUnit: string;
        toUnit: string;
        factor: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    addUnitConversion(dto: any): Promise<{
        id: string;
        createdAt: Date;
        fromUnit: string;
        toUnit: string;
        factor: import("@prisma/client/runtime/library").Decimal;
    }>;
    importProducts(file: any, body: any): Promise<{
        message: string;
        data: any[];
    }> | {
        message: string;
    };
    exportProducts(q: any, res: Response): Promise<Response<any, Record<string, any>> | {
        filename: string;
        content: string;
    }>;
    importTemplate(res: Response, q: any): Promise<Response<any, Record<string, any>> | {
        filename: string;
        content: string;
    }>;
    getMovements(q: any): Promise<{
        data: ({
            warehouse: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
            };
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
            type: string;
            productId: string;
            note: string | null;
            warehouseId: string | null;
            qty: number;
            referenceId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getOpnames(q: any): Promise<{
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
                productId: string;
                stokSistem: number;
                stokFisik: number;
                selisih: number;
                note: string | null;
                stockOpnameId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            warehouseId: string | null;
            date: Date;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createOpname(dto: any): Promise<{
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
            productId: string;
            stokSistem: number;
            stokFisik: number;
            selisih: number;
            note: string | null;
            stockOpnameId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        warehouseId: string | null;
        date: Date;
    }>;
    validateOpname(id: string): Promise<{
        data: {
            matched: number;
            more: number;
            less: number;
            details: any[];
        };
        message: string;
    }>;
    exportOpname(id: string, q: any, res: Response): Promise<Response<any, Record<string, any>> | {
        filename: string;
        content: string;
    }>;
    importOpname(id: string, file: any, body: any): Promise<{
        data: {
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
                productId: string;
                stokSistem: number;
                stokFisik: number;
                selisih: number;
                note: string | null;
                stockOpnameId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            warehouseId: string | null;
            date: Date;
        };
        message: string;
    }> | {
        message: string;
    };
    getWarehouses(): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        address: string | null;
    }[]>;
    getCategories(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        parentId: string | null;
    }[]>;
    getUnits(): Promise<{
        symbol: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    calculateFIFO(dto: {
        productId: string;
        qty: number;
    }): Promise<import("./costing.service.js").FIFOResult>;
    commitFIFO(dto: {
        productId: string;
        qty: number;
        referenceId?: string;
    }): Promise<import("./costing.service.js").FIFOResult>;
    updateAverageCost(dto: {
        productId: string;
        qtyMasuk: number;
        unitCost: number;
    }): Promise<{
        previousAvgCost: number;
        newAvgCost: number;
        newQty: number;
    }>;
    revaluate(dto: {
        productId: string;
        newCost: number;
        note?: string;
    }): Promise<{
        productId: string;
        oldCost: number;
        newCost: number;
        qty: number;
        adjustmentValue: number;
        message: string;
    }>;
    createCostLot(dto: {
        productId: string;
        nomorLot: string;
        qtyAwal: number;
        unitCost: number;
        expiryDate?: string;
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
    getLandedCosts(q: any): Promise<{
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
    getLandedCost(id: string): Promise<{
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
    createLandedCost(dto: {
        purchaseId: string;
        deskripsi: string;
        amount: number;
        splitMethod: any;
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
    applyLandedCosts(dto: {
        purchaseId: string;
        costs: {
            deskripsi: string;
            amount: number;
            splitMethod: any;
        }[];
    }): Promise<any[]>;
    validateLandedCost(id: string): Promise<any[]>;
    getValuationStats(warehouseId?: string): Promise<{
        totalInventoryValue: number;
        totalProducts: number;
        criticalLots: number;
        slowLots: number;
        totalLots: number;
        asOf: Date;
    }>;
    getStockValuation(date?: string, warehouseId?: string): Promise<{
        asOf: Date;
        totalValue: number;
        rows: import("./valuation.service.js").StockValuationRow[];
    }>;
    getStockAging(warehouseId?: string): Promise<import("./valuation.service.js").StockAgingRow[]>;
    getSlowMoving(days?: string, warehouseId?: string): Promise<{
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
    getStockLots(q: any): Promise<{
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
    getLots(q: any): Promise<{
        data: {
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
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getLot(id: string): Promise<{
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
    createLot(dto: any): Promise<{
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
    traceLot(id: string): Promise<{
        lot: {
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
        };
        movements: {
            id: string;
            createdAt: Date;
            type: string;
            productId: string;
            note: string | null;
            warehouseId: string | null;
            qty: number;
            referenceId: string | null;
        }[];
    }>;
    getProductLots(id: string): Promise<{
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
    }[]>;
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
    getReportStockCurrent(q: any): Promise<{
        data: ({
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
        })[];
    }>;
    getReportStockMovement(q: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            type: string;
            productId: string;
            note: string | null;
            warehouseId: string | null;
            qty: number;
            referenceId: string | null;
        }[];
    }>;
    getReportStockAging(q: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            referenceId: string | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
            date: Date;
            totalValue: import("@prisma/client/runtime/library").Decimal;
            movementType: string;
        }[];
        asOf: Date;
    }>;
    getReportStockValuation(q: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            referenceId: string | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
            date: Date;
            totalValue: import("@prisma/client/runtime/library").Decimal;
            movementType: string;
        }[];
        method: any;
    }>;
    getReportProductPerformance(q: any): Promise<{
        data: any[];
    }>;
    getTransfers(q: any): Promise<{
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
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                transferId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            noTransfer: string;
            fromWarehouse: string;
            toWarehouse: string;
            notes: string | null;
            createdBy: string | null;
            approvedBy: string | null;
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getTransfer(id: string): Promise<{
        data: {
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
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                transferId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            noTransfer: string;
            fromWarehouse: string;
            toWarehouse: string;
            notes: string | null;
            createdBy: string | null;
            approvedBy: string | null;
        };
        message: string;
    }>;
    createTransfer(dto: any): Promise<{
        data: {
            items: {
                id: string;
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                transferId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            noTransfer: string;
            fromWarehouse: string;
            toWarehouse: string;
            notes: string | null;
            createdBy: string | null;
            approvedBy: string | null;
        };
        message: string;
    }>;
    confirmTransfer(id: string): Promise<{
        data: any;
        message: string;
    }>;
    getTransfersV2(q: any): Promise<{
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
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                transferId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            noTransfer: string;
            fromWarehouse: string;
            toWarehouse: string;
            notes: string | null;
            createdBy: string | null;
            approvedBy: string | null;
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getTransferV2(id: string): Promise<{
        data: {
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
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                transferId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            noTransfer: string;
            fromWarehouse: string;
            toWarehouse: string;
            notes: string | null;
            createdBy: string | null;
            approvedBy: string | null;
        };
        message: string;
    }>;
    createTransferV2(dto: any): Promise<{
        data: {
            items: {
                id: string;
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                transferId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            noTransfer: string;
            fromWarehouse: string;
            toWarehouse: string;
            notes: string | null;
            createdBy: string | null;
            approvedBy: string | null;
        };
        message: string;
    }>;
    updateTransferV2(id: string, dto: any): Promise<{
        data: {
            items: {
                id: string;
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                notes: string | null;
                transferId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            noTransfer: string;
            fromWarehouse: string;
            toWarehouse: string;
            notes: string | null;
            createdBy: string | null;
            approvedBy: string | null;
        };
        message: string;
    }>;
    validateTransfer(id: string): Promise<{
        data: any;
        message: string;
    }>;
    cancelTransfer(id: string): Promise<{
        data: any;
        message: string;
    }>;
    getTransferPdf(id: string, q: any, res: Response): Promise<Response<any, Record<string, any>> | {
        filename: string;
        content: string;
    }>;
    getAdjustments(q: any): Promise<{
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
                productId: string;
                notes: string | null;
                adjustmentId: string;
                qtySystem: import("@prisma/client/runtime/library").Decimal;
                qtyActual: import("@prisma/client/runtime/library").Decimal;
                qtyDiff: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            warehouseId: string | null;
            notes: string | null;
            createdBy: string | null;
            noAdjust: string;
            reason: string | null;
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getAdjustment(id: string): Promise<{
        data: {
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
                productId: string;
                notes: string | null;
                adjustmentId: string;
                qtySystem: import("@prisma/client/runtime/library").Decimal;
                qtyActual: import("@prisma/client/runtime/library").Decimal;
                qtyDiff: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            warehouseId: string | null;
            notes: string | null;
            createdBy: string | null;
            noAdjust: string;
            reason: string | null;
        };
        message: string;
    }>;
    createAdjustment(dto: any): Promise<{
        data: {
            items: {
                id: string;
                productId: string;
                notes: string | null;
                adjustmentId: string;
                qtySystem: import("@prisma/client/runtime/library").Decimal;
                qtyActual: import("@prisma/client/runtime/library").Decimal;
                qtyDiff: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            warehouseId: string | null;
            notes: string | null;
            createdBy: string | null;
            noAdjust: string;
            reason: string | null;
        };
        message: string;
    }>;
    validateAdjustment(id: string): Promise<{
        data: any;
        message: string;
    }>;
    getReorderRules(q: any): Promise<{
        data: ({
            product: {
                id: string;
                name: string;
                stok: number;
            };
        } & {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            warehouseId: string | null;
            minQty: import("@prisma/client/runtime/library").Decimal;
            maxQty: import("@prisma/client/runtime/library").Decimal | null;
            reorderQty: import("@prisma/client/runtime/library").Decimal;
            leadTimeDays: number;
            lastTriggeredAt: Date | null;
        })[];
        message: string;
    }>;
    createReorderRule(dto: any): Promise<{
        data: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            warehouseId: string | null;
            minQty: import("@prisma/client/runtime/library").Decimal;
            maxQty: import("@prisma/client/runtime/library").Decimal | null;
            reorderQty: import("@prisma/client/runtime/library").Decimal;
            leadTimeDays: number;
            lastTriggeredAt: Date | null;
        };
        message: string;
    }>;
    updateReorderRule(id: string, dto: any): Promise<{
        data: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            warehouseId: string | null;
            minQty: import("@prisma/client/runtime/library").Decimal;
            maxQty: import("@prisma/client/runtime/library").Decimal | null;
            reorderQty: import("@prisma/client/runtime/library").Decimal;
            leadTimeDays: number;
            lastTriggeredAt: Date | null;
        };
        message: string;
    }>;
    deleteReorderRule(id: string): Promise<{
        data: any;
        message: string;
    }>;
}
