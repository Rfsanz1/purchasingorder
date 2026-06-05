import { PosService } from './pos.service.js';
export declare class PosController {
    private readonly svc;
    constructor(svc: PosService);
    login(dto: any): Promise<{
        user: {
            id: string;
            name: string;
            role: string;
        };
        sessionId: string;
    }>;
    getDashboard(): Promise<{
        todaySales: number;
        todayRevenue: number;
        openSessions: number;
    }>;
    getProducts(q: any): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
            };
        } & {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string | null;
            categoryId: string | null;
            hargaJual: import("@prisma/client/runtime/library").Decimal;
            stok: number;
            barcode: string | null;
        })[];
        total: number;
    }>;
    createProduct(dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        productId: string | null;
        categoryId: string | null;
        hargaJual: import("@prisma/client/runtime/library").Decimal;
        stok: number;
        barcode: string | null;
    }>;
    updateProduct(id: string, dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        productId: string | null;
        categoryId: string | null;
        hargaJual: import("@prisma/client/runtime/library").Decimal;
        stok: number;
        barcode: string | null;
    }>;
    patchProduct(id: string, dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        productId: string | null;
        categoryId: string | null;
        hargaJual: import("@prisma/client/runtime/library").Decimal;
        stok: number;
        barcode: string | null;
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
    }[]>;
    getSales(q: any): Promise<{
        data: ({
            posUser: {
                role: string;
                id: string;
                name: string;
                password: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                username: string;
            };
            items: ({
                posProduct: {
                    id: string;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    productId: string | null;
                    categoryId: string | null;
                    hargaJual: import("@prisma/client/runtime/library").Decimal;
                    stok: number;
                    barcode: string | null;
                };
            } & {
                id: string;
                qty: number;
                saleId: string;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                posProductId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            tanggal: Date;
            customerId: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            diskon: import("@prisma/client/runtime/library").Decimal;
            pajak: import("@prisma/client/runtime/library").Decimal;
            grandTotal: import("@prisma/client/runtime/library").Decimal;
            posUserId: string | null;
            sessionId: string | null;
            noStruk: string;
            bayar: import("@prisma/client/runtime/library").Decimal;
            kembalian: import("@prisma/client/runtime/library").Decimal;
            metodeBayar: string;
            splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
            loyaltyPointsEarned: number | null;
            loyaltyPointsUsed: number | null;
            discountType: string | null;
            discountValue: number | null;
            holdReference: string | null;
            returnReference: string | null;
        })[];
        total: number;
    }>;
    createSale(dto: any): Promise<{
        posUser: {
            role: string;
            id: string;
            name: string;
            password: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        };
        items: ({
            posProduct: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                productId: string | null;
                categoryId: string | null;
                hargaJual: import("@prisma/client/runtime/library").Decimal;
                stok: number;
                barcode: string | null;
            };
        } & {
            id: string;
            qty: number;
            saleId: string;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            posProductId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        customerId: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        diskon: import("@prisma/client/runtime/library").Decimal;
        pajak: import("@prisma/client/runtime/library").Decimal;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        posUserId: string | null;
        sessionId: string | null;
        noStruk: string;
        bayar: import("@prisma/client/runtime/library").Decimal;
        kembalian: import("@prisma/client/runtime/library").Decimal;
        metodeBayar: string;
        splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
        loyaltyPointsEarned: number | null;
        loyaltyPointsUsed: number | null;
        discountType: string | null;
        discountValue: number | null;
        holdReference: string | null;
        returnReference: string | null;
    }>;
    getTransactions(q: any): Promise<{
        data: ({
            posUser: {
                role: string;
                id: string;
                name: string;
                password: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                username: string;
            };
            items: ({
                posProduct: {
                    id: string;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    productId: string | null;
                    categoryId: string | null;
                    hargaJual: import("@prisma/client/runtime/library").Decimal;
                    stok: number;
                    barcode: string | null;
                };
            } & {
                id: string;
                qty: number;
                saleId: string;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                posProductId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            tanggal: Date;
            customerId: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            diskon: import("@prisma/client/runtime/library").Decimal;
            pajak: import("@prisma/client/runtime/library").Decimal;
            grandTotal: import("@prisma/client/runtime/library").Decimal;
            posUserId: string | null;
            sessionId: string | null;
            noStruk: string;
            bayar: import("@prisma/client/runtime/library").Decimal;
            kembalian: import("@prisma/client/runtime/library").Decimal;
            metodeBayar: string;
            splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
            loyaltyPointsEarned: number | null;
            loyaltyPointsUsed: number | null;
            discountType: string | null;
            discountValue: number | null;
            holdReference: string | null;
            returnReference: string | null;
        })[];
        total: number;
    }>;
    getTransaction(id: string): Promise<{
        posUser: {
            role: string;
            id: string;
            name: string;
            password: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        };
        items: ({
            posProduct: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                productId: string | null;
                categoryId: string | null;
                hargaJual: import("@prisma/client/runtime/library").Decimal;
                stok: number;
                barcode: string | null;
            };
        } & {
            id: string;
            qty: number;
            saleId: string;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            posProductId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        customerId: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        diskon: import("@prisma/client/runtime/library").Decimal;
        pajak: import("@prisma/client/runtime/library").Decimal;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        posUserId: string | null;
        sessionId: string | null;
        noStruk: string;
        bayar: import("@prisma/client/runtime/library").Decimal;
        kembalian: import("@prisma/client/runtime/library").Decimal;
        metodeBayar: string;
        splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
        loyaltyPointsEarned: number | null;
        loyaltyPointsUsed: number | null;
        discountType: string | null;
        discountValue: number | null;
        holdReference: string | null;
        returnReference: string | null;
    }>;
    createTransaction(dto: any): Promise<{
        posUser: {
            role: string;
            id: string;
            name: string;
            password: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        };
        items: ({
            posProduct: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                productId: string | null;
                categoryId: string | null;
                hargaJual: import("@prisma/client/runtime/library").Decimal;
                stok: number;
                barcode: string | null;
            };
        } & {
            id: string;
            qty: number;
            saleId: string;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            posProductId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        customerId: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        diskon: import("@prisma/client/runtime/library").Decimal;
        pajak: import("@prisma/client/runtime/library").Decimal;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        posUserId: string | null;
        sessionId: string | null;
        noStruk: string;
        bayar: import("@prisma/client/runtime/library").Decimal;
        kembalian: import("@prisma/client/runtime/library").Decimal;
        metodeBayar: string;
        splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
        loyaltyPointsEarned: number | null;
        loyaltyPointsUsed: number | null;
        discountType: string | null;
        discountValue: number | null;
        holdReference: string | null;
        returnReference: string | null;
    }>;
    holdTransaction(dto: any): Promise<{
        posUser: {
            role: string;
            id: string;
            name: string;
            password: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        };
        items: ({
            posProduct: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                productId: string | null;
                categoryId: string | null;
                hargaJual: import("@prisma/client/runtime/library").Decimal;
                stok: number;
                barcode: string | null;
            };
        } & {
            id: string;
            qty: number;
            saleId: string;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            posProductId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        customerId: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        diskon: import("@prisma/client/runtime/library").Decimal;
        pajak: import("@prisma/client/runtime/library").Decimal;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        posUserId: string | null;
        sessionId: string | null;
        noStruk: string;
        bayar: import("@prisma/client/runtime/library").Decimal;
        kembalian: import("@prisma/client/runtime/library").Decimal;
        metodeBayar: string;
        splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
        loyaltyPointsEarned: number | null;
        loyaltyPointsUsed: number | null;
        discountType: string | null;
        discountValue: number | null;
        holdReference: string | null;
        returnReference: string | null;
    }>;
    getHeldTransactions(): Promise<{
        data: ({
            posUser: {
                role: string;
                id: string;
                name: string;
                password: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                username: string;
            };
            items: ({
                posProduct: {
                    id: string;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    productId: string | null;
                    categoryId: string | null;
                    hargaJual: import("@prisma/client/runtime/library").Decimal;
                    stok: number;
                    barcode: string | null;
                };
            } & {
                id: string;
                qty: number;
                saleId: string;
                nama: string;
                harga: import("@prisma/client/runtime/library").Decimal;
                subtotal: import("@prisma/client/runtime/library").Decimal;
                posProductId: string;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            tanggal: Date;
            customerId: string | null;
            totalHarga: import("@prisma/client/runtime/library").Decimal;
            diskon: import("@prisma/client/runtime/library").Decimal;
            pajak: import("@prisma/client/runtime/library").Decimal;
            grandTotal: import("@prisma/client/runtime/library").Decimal;
            posUserId: string | null;
            sessionId: string | null;
            noStruk: string;
            bayar: import("@prisma/client/runtime/library").Decimal;
            kembalian: import("@prisma/client/runtime/library").Decimal;
            metodeBayar: string;
            splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
            loyaltyPointsEarned: number | null;
            loyaltyPointsUsed: number | null;
            discountType: string | null;
            discountValue: number | null;
            holdReference: string | null;
            returnReference: string | null;
        })[];
        total: number;
    }>;
    resumeTransaction(id: string, dto: any): Promise<{
        posUser: {
            role: string;
            id: string;
            name: string;
            password: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        };
        items: ({
            posProduct: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                productId: string | null;
                categoryId: string | null;
                hargaJual: import("@prisma/client/runtime/library").Decimal;
                stok: number;
                barcode: string | null;
            };
        } & {
            id: string;
            qty: number;
            saleId: string;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            posProductId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        customerId: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        diskon: import("@prisma/client/runtime/library").Decimal;
        pajak: import("@prisma/client/runtime/library").Decimal;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        posUserId: string | null;
        sessionId: string | null;
        noStruk: string;
        bayar: import("@prisma/client/runtime/library").Decimal;
        kembalian: import("@prisma/client/runtime/library").Decimal;
        metodeBayar: string;
        splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
        loyaltyPointsEarned: number | null;
        loyaltyPointsUsed: number | null;
        discountType: string | null;
        discountValue: number | null;
        holdReference: string | null;
        returnReference: string | null;
    }>;
    returnTransaction(id: string, dto: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        customerId: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        diskon: import("@prisma/client/runtime/library").Decimal;
        pajak: import("@prisma/client/runtime/library").Decimal;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        posUserId: string | null;
        sessionId: string | null;
        noStruk: string;
        bayar: import("@prisma/client/runtime/library").Decimal;
        kembalian: import("@prisma/client/runtime/library").Decimal;
        metodeBayar: string;
        splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
        loyaltyPointsEarned: number | null;
        loyaltyPointsUsed: number | null;
        discountType: string | null;
        discountValue: number | null;
        holdReference: string | null;
        returnReference: string | null;
    }>;
    getReceipt(id: string): Promise<{
        posUser: {
            role: string;
            id: string;
            name: string;
            password: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        };
        items: ({
            posProduct: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                productId: string | null;
                categoryId: string | null;
                hargaJual: import("@prisma/client/runtime/library").Decimal;
                stok: number;
                barcode: string | null;
            };
        } & {
            id: string;
            qty: number;
            saleId: string;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            posProductId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        customerId: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        diskon: import("@prisma/client/runtime/library").Decimal;
        pajak: import("@prisma/client/runtime/library").Decimal;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        posUserId: string | null;
        sessionId: string | null;
        noStruk: string;
        bayar: import("@prisma/client/runtime/library").Decimal;
        kembalian: import("@prisma/client/runtime/library").Decimal;
        metodeBayar: string;
        splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
        loyaltyPointsEarned: number | null;
        loyaltyPointsUsed: number | null;
        discountType: string | null;
        discountValue: number | null;
        holdReference: string | null;
        returnReference: string | null;
    }>;
    syncTransactions(dto: any): Promise<({
        posUser: {
            role: string;
            id: string;
            name: string;
            password: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            username: string;
        };
        items: ({
            posProduct: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                productId: string | null;
                categoryId: string | null;
                hargaJual: import("@prisma/client/runtime/library").Decimal;
                stok: number;
                barcode: string | null;
            };
        } & {
            id: string;
            qty: number;
            saleId: string;
            nama: string;
            harga: import("@prisma/client/runtime/library").Decimal;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            posProductId: string;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        customerId: string | null;
        totalHarga: import("@prisma/client/runtime/library").Decimal;
        diskon: import("@prisma/client/runtime/library").Decimal;
        pajak: import("@prisma/client/runtime/library").Decimal;
        grandTotal: import("@prisma/client/runtime/library").Decimal;
        posUserId: string | null;
        sessionId: string | null;
        noStruk: string;
        bayar: import("@prisma/client/runtime/library").Decimal;
        kembalian: import("@prisma/client/runtime/library").Decimal;
        metodeBayar: string;
        splitPayments: import("@prisma/client/runtime/library").JsonValue | null;
        loyaltyPointsEarned: number | null;
        loyaltyPointsUsed: number | null;
        discountType: string | null;
        discountValue: number | null;
        holdReference: string | null;
        returnReference: string | null;
    })[]>;
    getSessions(q: any): Promise<{
        data: {
            id: string;
            openedAt: Date;
            closedAt: Date;
            cashierName: string;
            openingCash: number;
            closingCash: number;
            totalTransactions: number;
            totalRevenue: number;
            status: string;
        }[];
        total: number;
    }>;
    getActiveSession(req: any): Promise<{
        id: string;
        openedAt: Date;
        cashierName: string;
        openingCash: number;
        totalTransactions: number;
        totalRevenue: number;
        status: string;
    }>;
    openSession(dto: any, req: any): Promise<{
        status: string;
        id: string;
        openedAt: Date;
        closedAt: Date | null;
        modalAwal: import("@prisma/client/runtime/library").Decimal;
        modalAkhir: import("@prisma/client/runtime/library").Decimal | null;
        posUserId: string;
    }>;
    closeSession(id: string, dto: any): Promise<{
        cashRevenue: any;
        closingCash: any;
        status: string;
        id: string;
        openedAt: Date;
        closedAt: Date | null;
        modalAwal: import("@prisma/client/runtime/library").Decimal;
        modalAkhir: import("@prisma/client/runtime/library").Decimal | null;
        posUserId: string;
    }>;
    getSession(id: string): Promise<{
        id: string;
        openedAt: Date;
        closedAt: Date;
        cashierName: string;
        openingCash: number;
        closingCash: number;
        totalTransactions: number;
        totalRevenue: number;
        status: string;
        breakdown: Record<string, number>;
    }>;
    getSessionReport(id: string): Promise<{
        reportByMethod: Record<string, number>;
        cashRevenue: number;
        expectedCash: number;
        cashDifference: number;
        totalTransactions: number;
        id: string;
        openedAt: Date;
        closedAt: Date;
        cashierName: string;
        openingCash: number;
        closingCash: number;
        totalRevenue: number;
        status: string;
        breakdown: Record<string, number>;
    }>;
    getLoyaltyConfig(): Promise<{
        id: string;
        isActive: boolean;
        pointsPerAmount: number;
        redeemRate: number;
        minRedeemPoints: number;
    }>;
    updateLoyaltyConfig(dto: any): Promise<{
        id: string;
        isActive: boolean;
        pointsPerAmount: number;
        redeemRate: number;
        minRedeemPoints: number;
    }>;
    getCustomerLoyalty(customerId: string): Promise<{
        id: string;
        customerId: string;
        points: number;
        totalEarned: number;
        totalRedeemed: number;
    }>;
    redeemLoyalty(dto: any): Promise<{
        id: string;
        customerId: string;
        points: number;
        totalEarned: number;
        totalRedeemed: number;
    }>;
    getTodayReport(): Promise<{
        totalRevenue: number;
        totalTransactions: number;
        hourly: {
            hour: number;
            count: number;
            revenue: number;
        }[];
        byMethod: Record<string, number>;
    }>;
    getDailyReports(q: any): Promise<{
        byDay: {
            date: string;
            revenue: number;
            transactions: number;
        }[];
        byMethod: Record<string, number>;
    }>;
    getProductReports(q: any): Promise<{
        product: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            productId: string | null;
            categoryId: string | null;
            hargaJual: import("@prisma/client/runtime/library").Decimal;
            stok: number;
            barcode: string | null;
        };
        quantity: number;
        revenue: number;
    }[]>;
    getPaymentReports(q: any): Promise<{
        method: string;
        total: number;
    }[]>;
    getCashierReports(q: any): Promise<{
        cashierId: string;
        cashierName: string;
        revenue: number;
        transactions: number;
    }[]>;
}
