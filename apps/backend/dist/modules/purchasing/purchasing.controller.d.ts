import { Response } from 'express';
import { PurchasingService } from './purchasing.service.js';
export declare class PurchasingController {
    private readonly svc;
    constructor(svc: PurchasingService);
    getStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
        billsUnpaid: number;
        totalValue: number | import("@prisma/client/runtime/library").Decimal;
        billsValue: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getRFQs(q: any): Promise<{
        data: ({
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
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
                productId: string | null;
                hargaBeli: import("@prisma/client/runtime/library").Decimal;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                rfqId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            supplierId: string;
            noRfq: string;
            deadline: Date | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getRFQ(id: string): Promise<{
        supplier: {
            bankAccount: string | null;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
            bankName: string | null;
            phone: string | null;
            city: string | null;
            npwp: string | null;
        };
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
            productId: string | null;
            hargaBeli: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            nama: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            rfqId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        noRfq: string;
        deadline: Date | null;
    }>;
    createRFQ(dto: any): Promise<{
        supplier: {
            bankAccount: string | null;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
            bankName: string | null;
            phone: string | null;
            city: string | null;
            npwp: string | null;
        };
        items: {
            id: string;
            productId: string | null;
            hargaBeli: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            nama: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            rfqId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        noRfq: string;
        deadline: Date | null;
    }>;
    updateRFQ(id: string, dto: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        noRfq: string;
        deadline: Date | null;
    }>;
    deleteRFQ(id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        noRfq: string;
        deadline: Date | null;
    }>;
    convertRFQ(id: string, dto: any): Promise<{
        supplier: {
            bankAccount: string | null;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
            bankName: string | null;
            phone: string | null;
            city: string | null;
            npwp: string | null;
        };
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
            productId: string | null;
            hargaBeli: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            nama: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            purchaseOrderId: string;
            qtyReceived: number;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        warehouseId: string | null;
        approvedBy: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        noPo: string;
        supplierId: string;
        tanggalKirim: Date | null;
        approvedAt: Date | null;
    }>;
    getPOs(q: any): Promise<{
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
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
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
                productId: string | null;
                hargaBeli: import("@prisma/client/runtime/library").Decimal;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                purchaseOrderId: string;
                qtyReceived: number;
            })[];
            goodsReceipts: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tanggal: Date;
                note: string | null;
                purchaseOrderId: string;
                noGr: string;
            }[];
            vendorBills: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                note: string | null;
                supplierId: string;
                purchaseOrderId: string | null;
                dueDate: Date | null;
                paidAmount: import("@prisma/client/runtime/library").Decimal;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                noBill: string;
                goodsReceiptId: string | null;
            }[];
            purchaseReturns: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                note: string | null;
                supplierId: string;
                purchaseOrderId: string | null;
                noReturn: string;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                goodsReceiptId: string | null;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            note: string | null;
            warehouseId: string | null;
            approvedBy: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            noPo: string;
            supplierId: string;
            tanggalKirim: Date | null;
            approvedAt: Date | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPO(id: string): Promise<{
        warehouse: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
        };
        supplier: {
            bankAccount: string | null;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
            bankName: string | null;
            phone: string | null;
            city: string | null;
            npwp: string | null;
        };
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
            productId: string | null;
            hargaBeli: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            nama: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            purchaseOrderId: string;
            qtyReceived: number;
        })[];
        goodsReceipts: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            note: string | null;
            purchaseOrderId: string;
            noGr: string;
        }[];
        vendorBills: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        }[];
        purchaseReturns: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            goodsReceiptId: string | null;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        warehouseId: string | null;
        approvedBy: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        noPo: string;
        supplierId: string;
        tanggalKirim: Date | null;
        approvedAt: Date | null;
    }>;
    createPO(dto: any): Promise<{
        supplier: {
            bankAccount: string | null;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
            bankName: string | null;
            phone: string | null;
            city: string | null;
            npwp: string | null;
        };
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
            productId: string | null;
            hargaBeli: import("@prisma/client/runtime/library").Decimal;
            qty: number;
            nama: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            purchaseOrderId: string;
            qtyReceived: number;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        warehouseId: string | null;
        approvedBy: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        noPo: string;
        supplierId: string;
        tanggalKirim: Date | null;
        approvedAt: Date | null;
    }>;
    updatePO(id: string, dto: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        warehouseId: string | null;
        approvedBy: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        noPo: string;
        supplierId: string;
        tanggalKirim: Date | null;
        approvedAt: Date | null;
    }>;
    approvePO(id: string, user: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        warehouseId: string | null;
        approvedBy: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        noPo: string;
        supplierId: string;
        tanggalKirim: Date | null;
        approvedAt: Date | null;
    }>;
    cancelPO(id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        warehouseId: string | null;
        approvedBy: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        noPo: string;
        supplierId: string;
        tanggalKirim: Date | null;
        approvedAt: Date | null;
    }>;
    changeStatus(id: string, status: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        warehouseId: string | null;
        approvedBy: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        noPo: string;
        supplierId: string;
        tanggalKirim: Date | null;
        approvedAt: Date | null;
    }>;
    getGRs(q: any): Promise<{
        data: ({
            purchaseOrder: {
                supplier: {
                    bankAccount: string | null;
                    id: string;
                    email: string | null;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    code: string;
                    address: string | null;
                    bankName: string | null;
                    phone: string | null;
                    city: string | null;
                    npwp: string | null;
                };
            } & {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tanggal: Date;
                note: string | null;
                warehouseId: string | null;
                approvedBy: string | null;
                totalHarga: import("@prisma/client/runtime/library").Decimal;
                noPo: string;
                supplierId: string;
                tanggalKirim: Date | null;
                approvedAt: Date | null;
            };
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
                productId: string | null;
                note: string | null;
                expiryDate: Date | null;
                unitCost: import("@prisma/client/runtime/library").Decimal;
                nama: string;
                qtyReceived: number;
                qtyOrdered: number;
                lotNumber: string | null;
                goodsReceiptId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            note: string | null;
            purchaseOrderId: string;
            noGr: string;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getGR(id: string): Promise<{
        purchaseOrder: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            note: string | null;
            warehouseId: string | null;
            approvedBy: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            noPo: string;
            supplierId: string;
            tanggalKirim: Date | null;
            approvedAt: Date | null;
        };
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
            productId: string | null;
            note: string | null;
            expiryDate: Date | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
            nama: string;
            qtyReceived: number;
            qtyOrdered: number;
            lotNumber: string | null;
            goodsReceiptId: string;
        })[];
        vendorBills: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        }[];
        purchaseReturns: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            goodsReceiptId: string | null;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        purchaseOrderId: string;
        noGr: string;
    }>;
    createGR(dto: any): Promise<{
        items: {
            id: string;
            productId: string | null;
            note: string | null;
            expiryDate: Date | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
            nama: string;
            qtyReceived: number;
            qtyOrdered: number;
            lotNumber: string | null;
            goodsReceiptId: string;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        purchaseOrderId: string;
        noGr: string;
    }>;
    receiveGR(id: string, dto: any): Promise<{
        purchaseOrder: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            note: string | null;
            warehouseId: string | null;
            approvedBy: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            noPo: string;
            supplierId: string;
            tanggalKirim: Date | null;
            approvedAt: Date | null;
        };
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
            productId: string | null;
            note: string | null;
            expiryDate: Date | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
            nama: string;
            qtyReceived: number;
            qtyOrdered: number;
            lotNumber: string | null;
            goodsReceiptId: string;
        })[];
        vendorBills: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        }[];
        purchaseReturns: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            goodsReceiptId: string | null;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        note: string | null;
        purchaseOrderId: string;
        noGr: string;
    }>;
    getDeliveryNote(id: string): Promise<{
        noGr: string;
        tanggal: Date;
        status: string;
        purchaseOrder: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            items: {
                id: string;
                productId: string | null;
                hargaBeli: import("@prisma/client/runtime/library").Decimal;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                purchaseOrderId: string;
                qtyReceived: number;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            note: string | null;
            warehouseId: string | null;
            approvedBy: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            noPo: string;
            supplierId: string;
            tanggalKirim: Date | null;
            approvedAt: Date | null;
        };
        supplier: {
            bankAccount: string | null;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
            bankName: string | null;
            phone: string | null;
            city: string | null;
            npwp: string | null;
        };
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
            productId: string | null;
            note: string | null;
            expiryDate: Date | null;
            unitCost: import("@prisma/client/runtime/library").Decimal;
            nama: string;
            qtyReceived: number;
            qtyOrdered: number;
            lotNumber: string | null;
            goodsReceiptId: string;
        })[];
        note: string;
    }>;
    getBillAging(): Promise<{
        data: {
            current: {
                items: any[];
                total: any;
                label: string;
            };
            d1_30: {
                items: any[];
                total: any;
                label: string;
            };
            d31_60: {
                items: any[];
                total: any;
                label: string;
            };
            d61_90: {
                items: any[];
                total: any;
                label: string;
            };
            over90: {
                items: any[];
                total: any;
                label: string;
            };
            grandTotal: any;
        };
    }>;
    getBills(q: any): Promise<{
        data: ({
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            items: {
                landedCost: import("@prisma/client/runtime/library").Decimal;
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                vendorBillId: string;
            }[];
            payments: {
                id: string;
                createdAt: Date;
                referensi: string | null;
                tanggal: Date;
                notes: string | null;
                method: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                vendorBillId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getBill(id: string): Promise<{
        data: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            purchaseOrder: {
                items: {
                    id: string;
                    productId: string | null;
                    hargaBeli: import("@prisma/client/runtime/library").Decimal;
                    qty: number;
                    nama: string;
                    subtotal: import("@prisma/client/runtime/library").Decimal;
                    purchaseOrderId: string;
                    qtyReceived: number;
                }[];
            } & {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tanggal: Date;
                note: string | null;
                warehouseId: string | null;
                approvedBy: string | null;
                totalHarga: import("@prisma/client/runtime/library").Decimal;
                noPo: string;
                supplierId: string;
                tanggalKirim: Date | null;
                approvedAt: Date | null;
            };
            goodsReceipt: {
                items: {
                    id: string;
                    productId: string | null;
                    note: string | null;
                    expiryDate: Date | null;
                    unitCost: import("@prisma/client/runtime/library").Decimal;
                    nama: string;
                    qtyReceived: number;
                    qtyOrdered: number;
                    lotNumber: string | null;
                    goodsReceiptId: string;
                }[];
            } & {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tanggal: Date;
                note: string | null;
                purchaseOrderId: string;
                noGr: string;
            };
            items: {
                landedCost: import("@prisma/client/runtime/library").Decimal;
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                vendorBillId: string;
            }[];
            payments: {
                id: string;
                createdAt: Date;
                referensi: string | null;
                tanggal: Date;
                notes: string | null;
                method: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                vendorBillId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        };
    }>;
    createBill(dto: any): Promise<{
        data: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            items: {
                landedCost: import("@prisma/client/runtime/library").Decimal;
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                vendorBillId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        };
        message: string;
    }>;
    updateBill(id: string, dto: any): Promise<{
        data: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            items: {
                landedCost: import("@prisma/client/runtime/library").Decimal;
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                vendorBillId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        };
        message: string;
    }>;
    deleteBill(id: string): Promise<{
        data: any;
        message: string;
    }>;
    createBillFromGr(grId: string, dto: any): Promise<{
        data: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            items: {
                landedCost: import("@prisma/client/runtime/library").Decimal;
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                vendorBillId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        };
        message: string;
    }>;
    addBillPayment(id: string, dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            referensi: string | null;
            tanggal: Date;
            notes: string | null;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            vendorBillId: string;
        };
        message: string;
    }>;
    getBillPayments(id: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            referensi: string | null;
            tanggal: Date;
            notes: string | null;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            vendorBillId: string;
        }[];
    }>;
    approveBill(id: string): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            noBill: string;
            goodsReceiptId: string | null;
        };
        message: string;
    }>;
    threeWayMatch(id: string): Promise<{
        data: {
            matched: boolean;
            discrepancies: any[];
            summary: {
                po: boolean;
                gr: boolean;
            };
        };
    }>;
    matchBill(id: string): Promise<{
        data: {
            matched: boolean;
            discrepancies: any[];
            summary: {
                po: boolean;
                gr: boolean;
            };
        };
    }>;
    getBillPdf(id: string, res: Response): Promise<void>;
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
        };
    }>;
    createLandedCost(dto: any): Promise<{
        data: {
            items: {
                id: string;
                createdAt: Date;
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                landedCostId: string;
                alokasiBiaya: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deskripsi: string;
            purchaseId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            splitMethod: import("@prisma/client").$Enums.LandedCostSplitMethod;
        };
        message: string;
    }>;
    updateLandedCost(id: string, dto: any): Promise<{
        data: {
            items: {
                id: string;
                createdAt: Date;
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                landedCostId: string;
                alokasiBiaya: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deskripsi: string;
            purchaseId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            splitMethod: import("@prisma/client").$Enums.LandedCostSplitMethod;
        };
        message: string;
    }>;
    validateLandedCost(id: string): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deskripsi: string;
            purchaseId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            splitMethod: import("@prisma/client").$Enums.LandedCostSplitMethod;
        };
        message: string;
    }>;
    getReturns(q: any): Promise<{
        data: ({
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            items: {
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                purchaseReturnId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            goodsReceiptId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getReturn(id: string): Promise<{
        data: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
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
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                purchaseReturnId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            goodsReceiptId: string | null;
        };
    }>;
    createReturn(dto: any): Promise<{
        data: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            items: {
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                purchaseReturnId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            goodsReceiptId: string | null;
        };
        message: string;
    }>;
    updateReturn(id: string, dto: any): Promise<{
        data: {
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
            items: {
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                purchaseReturnId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            goodsReceiptId: string | null;
        };
        message: string;
    }>;
    validateReturn(id: string): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            supplierId: string;
            purchaseOrderId: string | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            goodsReceiptId: string | null;
        };
        message: string;
    }>;
    getSuppliers(q: any): Promise<{
        data: {
            bankAccount: string | null;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
            bankName: string | null;
            phone: string | null;
            city: string | null;
            npwp: string | null;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getSupplier(id: string): Promise<{
        data: {
            totalPOs: number;
            totalBills: number;
            avgRating: number;
            purchaseOrders: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tanggal: Date;
                note: string | null;
                warehouseId: string | null;
                approvedBy: string | null;
                totalHarga: import("@prisma/client/runtime/library").Decimal;
                noPo: string;
                supplierId: string;
                tanggalKirim: Date | null;
                approvedAt: Date | null;
            }[];
            ratings: {
                id: string;
                createdAt: Date;
                supplierId: string;
                rating: number;
                comment: string | null;
                reviewerId: string | null;
            }[];
            bankAccount: string | null;
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            code: string;
            address: string | null;
            bankName: string | null;
            phone: string | null;
            city: string | null;
            npwp: string | null;
        };
    }>;
    createSupplier(dto: any): Promise<{
        bankAccount: string | null;
        id: string;
        email: string | null;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        address: string | null;
        bankName: string | null;
        phone: string | null;
        city: string | null;
        npwp: string | null;
    }>;
    updateSupplier(id: string, dto: any): Promise<{
        bankAccount: string | null;
        id: string;
        email: string | null;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        address: string | null;
        bankName: string | null;
        phone: string | null;
        city: string | null;
        npwp: string | null;
    }>;
    deleteSupplier(id: string): Promise<{
        bankAccount: string | null;
        id: string;
        email: string | null;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        address: string | null;
        bankName: string | null;
        phone: string | null;
        city: string | null;
        npwp: string | null;
    }>;
    getSupplierHistory(id: string): Promise<{
        data: {
            purchaseOrders: ({
                items: {
                    id: string;
                    productId: string | null;
                    hargaBeli: import("@prisma/client/runtime/library").Decimal;
                    qty: number;
                    nama: string;
                    subtotal: import("@prisma/client/runtime/library").Decimal;
                    purchaseOrderId: string;
                    qtyReceived: number;
                }[];
            } & {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tanggal: Date;
                note: string | null;
                warehouseId: string | null;
                approvedBy: string | null;
                totalHarga: import("@prisma/client/runtime/library").Decimal;
                noPo: string;
                supplierId: string;
                tanggalKirim: Date | null;
                approvedAt: Date | null;
            })[];
            vendorBills: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                note: string | null;
                supplierId: string;
                purchaseOrderId: string | null;
                dueDate: Date | null;
                paidAmount: import("@prisma/client/runtime/library").Decimal;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                noBill: string;
                goodsReceiptId: string | null;
            }[];
            purchaseReturns: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                note: string | null;
                supplierId: string;
                purchaseOrderId: string | null;
                noReturn: string;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                goodsReceiptId: string | null;
            }[];
        };
    }>;
    getSupplierPricelist(id: string): Promise<{
        data: ({
            supplier: {
                bankAccount: string | null;
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                code: string;
                address: string | null;
                bankName: string | null;
                phone: string | null;
                city: string | null;
                npwp: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            minQty: number;
            leadTimeDays: number;
            harga: import("@prisma/client/runtime/library").Decimal;
            supplierId: string;
            validFrom: Date | null;
            validTo: Date | null;
        })[];
    }>;
    addSupplierPricelist(id: string, dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            minQty: number;
            leadTimeDays: number;
            harga: import("@prisma/client/runtime/library").Decimal;
            supplierId: string;
            validFrom: Date | null;
            validTo: Date | null;
        };
        message: string;
    }>;
    rateSupplier(id: string, dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            supplierId: string;
            rating: number;
            comment: string | null;
            reviewerId: string | null;
        };
        message: string;
    }>;
    compareQuotes(q: any): Promise<{
        supplierId: any;
        supplier: any;
        total: any;
        items: any;
        rfqCount: any;
    }[]>;
}
