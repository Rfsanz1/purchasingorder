import { SalesService } from './sales.service.js';
export declare class SalesController {
    private readonly svc;
    constructor(svc: SalesService);
    getSummary(q: any): Promise<{
        totalOrders: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        pendingOrders: number;
    }>;
    getSalesList(): Promise<string[]>;
    getOrders(q: any): Promise<{
        data: ({
            customer: {
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
            };
            orderItems: ({
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
                id: number;
                productId: string | null;
                qty: number;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                orderId: number;
            })[];
        } & {
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            items: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            salesName: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            kledoInvoiceId: string | null;
            namaCustomer: string;
            noHp: string | null;
            alamat: string | null;
            catatan: string | null;
            statusPengiriman: string | null;
            driverName: string | null;
            fotoPengiriman: string | null;
            lokasiToken: string | null;
            lokasiLat: string | null;
            lokasiLng: string | null;
            lokasiUpdatedAt: Date | null;
            kledoSynced: boolean;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getOrder(id: string): Promise<{
        customer: {
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
        };
        orderItems: ({
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
            id: number;
            productId: string | null;
            qty: number;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            orderId: number;
        })[];
    } & {
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        salesName: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        kledoInvoiceId: string | null;
        namaCustomer: string;
        noHp: string | null;
        alamat: string | null;
        catatan: string | null;
        statusPengiriman: string | null;
        driverName: string | null;
        fotoPengiriman: string | null;
        lokasiToken: string | null;
        lokasiLat: string | null;
        lokasiLng: string | null;
        lokasiUpdatedAt: Date | null;
        kledoSynced: boolean;
    }>;
    createOrder(dto: any): Promise<{
        orderItems: ({
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
            id: number;
            productId: string | null;
            qty: number;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            orderId: number;
        })[];
    } & {
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        salesName: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        kledoInvoiceId: string | null;
        namaCustomer: string;
        noHp: string | null;
        alamat: string | null;
        catatan: string | null;
        statusPengiriman: string | null;
        driverName: string | null;
        fotoPengiriman: string | null;
        lokasiToken: string | null;
        lokasiLat: string | null;
        lokasiLng: string | null;
        lokasiUpdatedAt: Date | null;
        kledoSynced: boolean;
    }>;
    updateOrder(id: string, dto: any): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        salesName: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        kledoInvoiceId: string | null;
        namaCustomer: string;
        noHp: string | null;
        alamat: string | null;
        catatan: string | null;
        statusPengiriman: string | null;
        driverName: string | null;
        fotoPengiriman: string | null;
        lokasiToken: string | null;
        lokasiLat: string | null;
        lokasiLng: string | null;
        lokasiUpdatedAt: Date | null;
        kledoSynced: boolean;
    }>;
    deleteOrder(id: string): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        salesName: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        kledoInvoiceId: string | null;
        namaCustomer: string;
        noHp: string | null;
        alamat: string | null;
        catatan: string | null;
        statusPengiriman: string | null;
        driverName: string | null;
        fotoPengiriman: string | null;
        lokasiToken: string | null;
        lokasiLat: string | null;
        lokasiLng: string | null;
        lokasiUpdatedAt: Date | null;
        kledoSynced: boolean;
    }>;
    updatePengiriman(id: string, dto: any): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        salesName: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        kledoInvoiceId: string | null;
        namaCustomer: string;
        noHp: string | null;
        alamat: string | null;
        catatan: string | null;
        statusPengiriman: string | null;
        driverName: string | null;
        fotoPengiriman: string | null;
        lokasiToken: string | null;
        lokasiLat: string | null;
        lokasiLng: string | null;
        lokasiUpdatedAt: Date | null;
        kledoSynced: boolean;
    }>;
    uploadBukti(id: string, b64: string): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        items: import("@prisma/client/runtime/library").JsonValue;
        customerId: string | null;
        salesName: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        kledoInvoiceId: string | null;
        namaCustomer: string;
        noHp: string | null;
        alamat: string | null;
        catatan: string | null;
        statusPengiriman: string | null;
        driverName: string | null;
        fotoPengiriman: string | null;
        lokasiToken: string | null;
        lokasiLat: string | null;
        lokasiLng: string | null;
        lokasiUpdatedAt: Date | null;
        kledoSynced: boolean;
    }>;
    sendWa(id: string, dto: any): Promise<unknown>;
    getSales(q: any): Promise<{
        data: ({
            customer: {
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
                saleId: string;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            noFaktur: string;
            customerId: string | null;
            salesName: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            diskon: import("@prisma/client/runtime/library").Decimal;
            pajak: import("@prisma/client/runtime/library").Decimal;
            grandTotal: import("@prisma/client/runtime/library").Decimal;
            kledoId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getCustomerLoc(t: string): Promise<{
        namaCustomer: string;
        lokasiLat: string;
        lokasiLng: string;
    }>;
    saveCustomerLoc(t: string, dto: any): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getQuotations(q: any): Promise<{
        data: ({
            customer: {
                id: string;
                name: string;
            };
            items: {
                id: string;
                unit: string | null;
                productId: string | null;
                note: string | null;
                qty: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                discount: import("@prisma/client/runtime/library").Decimal;
                quotationId: string;
                productName: string;
                hargaSatuan: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            status: string;
            tax: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            customerId: string | null;
            salesName: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            nomorQuotation: string;
            validUntil: Date | null;
            discount: import("@prisma/client/runtime/library").Decimal;
            quotationId: string | null;
            deletedAt: Date | null;
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getQuotation(id: string): Promise<{
        data: {
            customer: {
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
                unit: string | null;
                productId: string | null;
                note: string | null;
                qty: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                discount: import("@prisma/client/runtime/library").Decimal;
                quotationId: string;
                productName: string;
                hargaSatuan: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            status: string;
            tax: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            customerId: string | null;
            salesName: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            nomorQuotation: string;
            validUntil: Date | null;
            discount: import("@prisma/client/runtime/library").Decimal;
            quotationId: string | null;
            deletedAt: Date | null;
        };
        message: string;
    }>;
    createQuotation(dto: any): Promise<{
        data: {
            items: {
                id: string;
                unit: string | null;
                productId: string | null;
                note: string | null;
                qty: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                discount: import("@prisma/client/runtime/library").Decimal;
                quotationId: string;
                productName: string;
                hargaSatuan: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            status: string;
            tax: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            customerId: string | null;
            salesName: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            nomorQuotation: string;
            validUntil: Date | null;
            discount: import("@prisma/client/runtime/library").Decimal;
            quotationId: string | null;
            deletedAt: Date | null;
        };
        message: string;
    }>;
    updateQuotation(id: string, dto: any): Promise<{
        data: {
            items: {
                id: string;
                unit: string | null;
                productId: string | null;
                note: string | null;
                qty: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                discount: import("@prisma/client/runtime/library").Decimal;
                quotationId: string;
                productName: string;
                hargaSatuan: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            status: string;
            tax: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            customerId: string | null;
            salesName: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            nomorQuotation: string;
            validUntil: Date | null;
            discount: import("@prisma/client/runtime/library").Decimal;
            quotationId: string | null;
            deletedAt: Date | null;
        };
        message: string;
    }>;
    deleteQuotation(id: string): Promise<{
        data: any;
        message: string;
    }>;
    confirmQuotation(id: string): Promise<{
        data: {
            status: string;
            tax: import("@prisma/client/runtime/library").Decimal;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            note: string | null;
            customerId: string | null;
            salesName: string | null;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            nomorQuotation: string;
            validUntil: Date | null;
            discount: import("@prisma/client/runtime/library").Decimal;
            quotationId: string | null;
            deletedAt: Date | null;
        };
        message: string;
    }>;
    convertQuotationToOrder(id: string): Promise<{
        data: {
            orderItems: ({
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
                id: number;
                productId: string | null;
                qty: number;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                orderId: number;
            })[];
        } & {
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            items: import("@prisma/client/runtime/library").JsonValue;
            customerId: string | null;
            salesName: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            kledoInvoiceId: string | null;
            namaCustomer: string;
            noHp: string | null;
            alamat: string | null;
            catatan: string | null;
            statusPengiriman: string | null;
            driverName: string | null;
            fotoPengiriman: string | null;
            lokasiToken: string | null;
            lokasiLat: string | null;
            lokasiLng: string | null;
            lokasiUpdatedAt: Date | null;
            kledoSynced: boolean;
        };
        message: string;
    }>;
    convertQuotationToInvoice(id: string): Promise<{
        data: {
            customer: {
                id: string;
                name: string;
            };
            items: {
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                invoiceId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tanggal: Date;
            notes: string | null;
            customerId: string | null;
            salesName: string | null;
            diskon: import("@prisma/client/runtime/library").Decimal;
            pajak: import("@prisma/client/runtime/library").Decimal;
            grandTotal: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            orderId: number | null;
            noInvoice: string;
            dueDate: Date | null;
            paidAmount: import("@prisma/client/runtime/library").Decimal;
            sentAt: Date | null;
        };
        message: string;
    }>;
    sendQuotationWa(id: string, dto: any): Promise<{
        message: string;
        data?: undefined;
        error?: undefined;
        skipped?: undefined;
        preview?: undefined;
    } | {
        data: unknown;
        message: string;
        error?: undefined;
        skipped?: undefined;
        preview?: undefined;
    } | {
        error: any;
        message?: undefined;
        data?: undefined;
        skipped?: undefined;
        preview?: undefined;
    } | {
        skipped: boolean;
        preview: any;
        message?: undefined;
        data?: undefined;
        error?: undefined;
    }>;
    sendQuotationEmail(id: string, dto: any): Promise<{
        skipped: boolean;
        message: string;
    }>;
    getSalesReturns(q: any): Promise<{
        data: ({
            customer: {
                id: string;
                name: string;
            };
            items: {
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                returnId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string | null;
            customerId: string | null;
            orderId: number | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getSalesReturn(id: string): Promise<{
        data: {
            customer: {
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
            };
            items: {
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                returnId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string | null;
            customerId: string | null;
            orderId: number | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    createSalesReturn(dto: any): Promise<{
        data: {
            items: {
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                returnId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string | null;
            customerId: string | null;
            orderId: number | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    updateSalesReturn(id: string, dto: any): Promise<{
        data: {
            items: {
                id: string;
                productId: string | null;
                qty: number;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                returnId: string;
            }[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string | null;
            customerId: string | null;
            orderId: number | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    validateReturn(id: string): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string | null;
            customerId: string | null;
            orderId: number | null;
            noReturn: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    getPricelists(q: any): Promise<{
        data: ({
            items: {
                id: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: string | null;
                minQty: number;
                discount: import("@prisma/client/runtime/library").Decimal;
                pricelistId: string;
            }[];
        } & {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            currency: string;
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getPricelist(id: string): Promise<{
        data: {
            items: {
                id: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: string | null;
                minQty: number;
                discount: import("@prisma/client/runtime/library").Decimal;
                pricelistId: string;
            }[];
        } & {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            currency: string;
        };
        message: string;
    }>;
    createPricelist(dto: any): Promise<{
        data: {
            items: {
                id: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: string | null;
                minQty: number;
                discount: import("@prisma/client/runtime/library").Decimal;
                pricelistId: string;
            }[];
        } & {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            currency: string;
        };
        message: string;
    }>;
    updatePricelist(id: string, dto: any): Promise<{
        data: {
            items: {
                id: string;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: string | null;
                minQty: number;
                discount: import("@prisma/client/runtime/library").Decimal;
                pricelistId: string;
            }[];
        } & {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            currency: string;
        };
        message: string;
    }>;
    deletePricelist(id: string): Promise<{
        data: any;
        message: string;
    }>;
    getPricelistItems(id: string): Promise<{
        data: {
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string | null;
            minQty: number;
            discount: import("@prisma/client/runtime/library").Decimal;
            pricelistId: string;
        }[];
        message: string;
    }>;
    addPricelistItem(id: string, dto: any): Promise<{
        data: {
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
            productId: string | null;
            minQty: number;
            discount: import("@prisma/client/runtime/library").Decimal;
            pricelistId: string;
        };
        message: string;
    }>;
}
