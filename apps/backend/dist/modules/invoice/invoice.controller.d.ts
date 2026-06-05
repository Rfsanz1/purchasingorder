import { InvoiceService } from './invoice.service.js';
import type { Response } from 'express';
export declare class InvoiceController {
    private readonly svc;
    constructor(svc: InvoiceService);
    getStats(): Promise<{
        data: {
            total: number;
            draft: number;
            sent: number;
            paid: number;
            partial: number;
            overdue: number;
            totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        };
        message: string;
    }>;
    getAging(): Promise<{
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
        message: string;
    }>;
    findAll(q: any): Promise<{
        data: ({
            customer: {
                id: string;
                name: string;
                phone: string;
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
            payments: {
                id: string;
                createdAt: Date;
                referensi: string | null;
                tanggal: Date;
                notes: string | null;
                method: string;
                amount: import("@prisma/client/runtime/library").Decimal;
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
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    findOne(id: string): Promise<{
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
                invoiceId: string;
            }[];
            payments: {
                id: string;
                createdAt: Date;
                referensi: string | null;
                tanggal: Date;
                notes: string | null;
                method: string;
                amount: import("@prisma/client/runtime/library").Decimal;
                invoiceId: string;
            }[];
            creditNotes: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                reason: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                invoiceId: string;
                noCreditNote: string;
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
    create(dto: any): Promise<{
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
    update(id: string, dto: any): Promise<{
        data: {
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
    remove(id: string): Promise<{
        data: any;
        message: string;
    }>;
    send(id: string): Promise<{
        data: {
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
    getPayments(id: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            referensi: string | null;
            tanggal: Date;
            notes: string | null;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
        }[];
        message: string;
    }>;
    addPayment(id: string, dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            referensi: string | null;
            tanggal: Date;
            notes: string | null;
            method: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
        };
        message: string;
    }>;
    getCreditNotes(id: string): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            noCreditNote: string;
        }[];
        message: string;
    }>;
    issueCreditNote(id: string, dto: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            invoiceId: string;
            noCreditNote: string;
        };
        message: string;
    }>;
    sendReminder(id: string, dto: any): Promise<{
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
        preview: string;
        message: string;
        data?: undefined;
        error?: undefined;
    }>;
    sendWhatsApp(id: string, dto: any): Promise<{
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
        preview: string;
        message: string;
        data?: undefined;
        error?: undefined;
    }>;
    setRecurring(id: string, dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            startDate: Date;
            endDate: Date | null;
            frequency: string;
            nextRunDate: Date;
            invoiceId: string;
        };
        message: string;
    }>;
    deleteRecurring(id: string): Promise<{
        data: any;
        message: string;
    }>;
    createPaymentLink(id: string, dto: any): Promise<{
        data: {
            paymentUrl: string;
            token: string;
            expiredAt: Date;
        };
        message: string;
    }>;
    getPdf(id: string, res: Response): Promise<void>;
}
