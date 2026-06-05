import { PrismaService } from '../../database/prisma.service.js';
export declare class PosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    login(username: string, password: string): Promise<{
        user: {
            id: string;
            name: string;
            role: string;
        };
        sessionId: string;
    }>;
    getProducts(query: any): Promise<{
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
    getSales(query: any): Promise<{
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
    syncTransactions(transactions: any[]): Promise<({
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
    getDashboard(): Promise<{
        todaySales: number;
        todayRevenue: number;
        openSessions: number;
    }>;
    getCategories(): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
    }[]>;
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
    getSessions(query: any): Promise<{
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
    getActiveSession(currentUser: any): Promise<{
        id: string;
        openedAt: Date;
        cashierName: string;
        openingCash: number;
        totalTransactions: number;
        totalRevenue: number;
        status: string;
    }>;
    openSession(dto: any, currentUser: any): Promise<{
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
    getReportsDaily(query: any): Promise<{
        byDay: {
            date: string;
            revenue: number;
            transactions: number;
        }[];
        byMethod: Record<string, number>;
    }>;
    getReportsProducts(query: any): Promise<{
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
    getReportsPayments(query: any): Promise<{
        method: string;
        total: number;
    }[]>;
    getReportsCashiers(query: any): Promise<{
        cashierId: string;
        cashierName: string;
        revenue: number;
        transactions: number;
    }[]>;
    private prepareSaleData;
    private extractCashAmount;
    private generateNoStruk;
    private prepareSaleAmounts;
    private adjustCustomerLoyalty;
    private createSessionCloseJournal;
}
