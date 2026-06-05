import { PrismaService } from '../../database/prisma.service.js';
import { SettingsService } from '../settings/settings.service.js';
import { JournalService } from '../finance/journal.service.js';
export declare class InventoryService {
    private readonly prisma;
    private readonly settings;
    private readonly journalSvc;
    constructor(prisma: PrismaService, settings: SettingsService, journalSvc: JournalService);
    getProducts(query: any): Promise<{
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
    getVariants(productId: string): Promise<{
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
    createVariant(productId: string, dto: any): Promise<{
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
    updateVariant(productId: string, variantId: string, dto: any): Promise<{
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
    deleteVariant(productId: string, variantId: string): Promise<{
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
    getBundleComponents(productId: string): Promise<({
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
    addBundleComponent(productId: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        componentId: string;
    }>;
    getTierPrices(productId: string): Promise<{
        id: string;
        createdAt: Date;
        price: import("@prisma/client/runtime/library").Decimal;
        productId: string;
        minQty: import("@prisma/client/runtime/library").Decimal;
        maxQty: import("@prisma/client/runtime/library").Decimal | null;
        currency: string;
    }[]>;
    addTierPrice(productId: string, dto: any): Promise<{
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
    importProducts(file: any): Promise<{
        message: string;
        data: any[];
    }>;
    exportProducts(query: any): Promise<{
        filename: string;
        content: string;
    }>;
    importTemplate(): Promise<{
        filename: string;
        content: string;
    }>;
    getLots(query: any): Promise<{
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
    getLotTrace(id: string): Promise<{
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
    getProductLots(productId: string): Promise<{
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
    generateTransferPdf(id: string): Promise<{
        filename: string;
        content: string;
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
    updateStok(id: string, qty: number, type: 'in' | 'out', note?: string): Promise<{
        stok: number;
    }>;
    adjustWarehouseStock(productId: string, warehouseId: string | null | undefined, delta: number): Promise<void>;
    getBrands(): Promise<string[]>;
    getStockMovements(query: any): Promise<{
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
    getStockOpnames(query: any): Promise<{
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
    createStockOpname(dto: any): Promise<{
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
    validateStockOpname(id: string): Promise<{
        data: {
            matched: number;
            more: number;
            less: number;
            details: any[];
        };
        message: string;
    }>;
    exportStockOpname(id: string): Promise<{
        filename: string;
        content: string;
    }>;
    importStockOpname(id: string, file: any): Promise<{
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
    }>;
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
    getStats(): Promise<{
        totalProducts: number;
        lowStock: number;
        totalStok: number;
    }>;
    getTransfers(query: any): Promise<{
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
    updateTransfer(id: string, dto: any): Promise<{
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
    validateTransfer(id: string): Promise<{
        data: any;
        message: string;
    }>;
    cancelTransfer(id: string): Promise<{
        data: any;
        message: string;
    }>;
    getAdjustments(query: any): Promise<{
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
    getReorderRules(query: any): Promise<{
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
    getStockCurrent(query: any): Promise<{
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
    getStockMovementReport(query: any): Promise<{
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
    getStockAging(query: any): Promise<{
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
    getStockValuationReport(query: any): Promise<{
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
    getProductPerformance(query: any): Promise<{
        data: any[];
    }>;
}
