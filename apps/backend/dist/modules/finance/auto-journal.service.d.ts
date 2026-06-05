import { PrismaService } from '../../database/prisma.service.js';
export declare class AutoJournalService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private genNomor;
    private findAccount;
    private createAutoJournal;
    /** Saat Sales Invoice POSTED → Debit Piutang (1200), Kredit Pendapatan (4000) */
    onSalesInvoicePosted(invoiceId: string, amount: number, tanggal: Date, ref: string): Promise<void>;
    /** Saat Purchase Invoice POSTED → Debit Pembelian (50xx), Kredit Hutang Dagang (21xx) */
    onPurchaseInvoicePosted(invoiceId: string, amount: number, tanggal: Date, ref: string): Promise<void>;
    /** Payment diterima → Debit Kas/Bank (10xx/11xx), Kredit Piutang (12xx) */
    onPaymentReceived(paymentId: string, amount: number, tanggal: Date, ref: string, isBankPayment?: boolean): Promise<void>;
    /** Payment dibayar → Debit Hutang Dagang (21xx), Kredit Kas/Bank (10xx/11xx) */
    onPaymentMade(paymentId: string, amount: number, tanggal: Date, ref: string, isBankPayment?: boolean): Promise<void>;
    /** Barang keluar inventory → Debit HPP (50xx), Kredit Persediaan (14xx) */
    onInventoryOut(moveId: string, amount: number, tanggal: Date, ref: string): Promise<void>;
}
