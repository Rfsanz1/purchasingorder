import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../database/prisma.service.js';
export declare class KledoService {
    private readonly http;
    private readonly prisma;
    private readonly logger;
    private readonly baseUrl;
    private readonly token;
    constructor(http: HttpService, prisma: PrismaService);
    private get headers();
    getStatus(): Promise<{
        connected: boolean;
        message: any;
    }>;
    getProducts(query?: any): Promise<any>;
    getContacts(query?: any): Promise<any>;
    getInvoices(query?: any): Promise<any>;
    findOrCreateContact(name: string, phone?: string): Promise<number>;
    createInvoice(dto: {
        namaCustomer: string;
        noHp?: string;
        memo?: string;
        orderId?: number | string;
        items: Array<{
            kledoProductId?: string | null;
            nama: string;
            qty: number;
            harga: number;
            unitId?: number;
        }>;
        dueDays?: number;
    }): Promise<{
        success: boolean;
        kledoInvoiceId: any;
        message: any;
    } | {
        success: boolean;
        message: any;
        kledoInvoiceId?: undefined;
    }>;
    getSpmBrands(): {
        brand: string;
        pic: string;
    }[];
    isSpmBrand(brand: string): boolean;
    withMargin(price: number, margin?: number): number;
    /** ─── BACKGROUND SYNC HELPERS ─── */
    /** Jalankan fn di background, update log saat selesai */
    private runBackground;
    /** Delay helper */
    private sleep;
    /** Fetch satu halaman Kledo — dengan retry otomatis saat 429 */
    private fetchPage;
    /** ─── PRODUK SYNC ─── */
    syncProducts(): Promise<{
        jobId: string;
        message: string;
        total?: number;
    }>;
    /** ─── KONTAK SYNC ─── */
    syncContacts(): Promise<{
        jobId: string;
        message: string;
        total?: number;
    }>;
    /** ─── INVOICE SYNC ─── */
    syncInvoices(limit?: number): Promise<{
        jobId: string;
        message: string;
    }>;
    /** ─── SYNC ALL (background semua) ─── */
    syncAll(): Promise<{
        jobs: {
            products: string;
            contacts: string;
            invoices: string;
        };
        message: string;
    }>;
    /** ─── LEGACY ─── */
    syncNow(): Promise<{
        jobId: string;
        message: string;
        total?: number;
    }>;
    autoSync(): Promise<{
        message: string;
    }>;
    getSyncLogs(query: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            type: string;
            message: string | null;
            payload: import("@prisma/client/runtime/library").JsonValue | null;
            response: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        total: number;
    }>;
}
