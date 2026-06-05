import { KledoService } from './kledo.service.js';
export declare class KledoController {
    private readonly svc;
    constructor(svc: KledoService);
    getStatus(): Promise<{
        connected: boolean;
        message: any;
    }>;
    getSpmBrands(): {
        brand: string;
        pic: string;
    }[];
    getProducts(q: any): Promise<any>;
    getContacts(q: any): Promise<any>;
    getInvoices(q: any): Promise<any>;
    createInvoice(dto: any): Promise<{
        success: boolean;
        kledoInvoiceId: any;
        message: any;
    } | {
        success: boolean;
        message: any;
        kledoInvoiceId?: undefined;
    }>;
    syncProducts(): Promise<{
        jobId: string;
        message: string;
        total?: number;
    }>;
    syncContacts(): Promise<{
        jobId: string;
        message: string;
        total?: number;
    }>;
    syncInvoices(limit?: string): Promise<{
        jobId: string;
        message: string;
    }>;
    syncAll(): Promise<{
        jobs: {
            products: string;
            contacts: string;
            invoices: string;
        };
        message: string;
    }>;
    autoSync(): Promise<{
        message: string;
    }>;
    getSyncLogs(q: any): Promise<{
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
