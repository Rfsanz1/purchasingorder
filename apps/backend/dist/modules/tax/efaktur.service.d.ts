import { PrismaService } from '../../database/prisma.service.js';
import { EFakturStatus } from '@prisma/client';
export interface EFakturCSVRow {
    FK: string;
    KD_JENIS_TRANSAKSI: string;
    FG_PENGGANTI: string;
    NOMOR_FAKTUR: string;
    MASA_PAJAK: string;
    TAHUN_PAJAK: string;
    TANGGAL_FAKTUR: string;
    NPWP: string;
    NAMA: string;
    ALAMAT_LENGKAP: string;
    JUMLAH_DPP: string;
    JUMLAH_PPN: string;
    JUMLAH_PPNBM: string;
    IS_CREDITABLE: string;
}
export declare class EFakturService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(periode?: string): Promise<({
        tax: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            accountId: string | null;
            nama: string;
            tipe: import("@prisma/client").$Enums.TaxType;
            kode: string;
            rate: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        status: import("@prisma/client").$Enums.EFakturStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        referenceId: string | null;
        taxId: string | null;
        npwpPembeli: string | null;
        namaPembeli: string | null;
        nomorFaktur: string;
        nilaiDPP: import("@prisma/client/runtime/library").Decimal;
        nilaiPPN: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    findOne(id: string): Promise<{
        tax: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            accountId: string | null;
            nama: string;
            tipe: import("@prisma/client").$Enums.TaxType;
            kode: string;
            rate: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        status: import("@prisma/client").$Enums.EFakturStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        referenceId: string | null;
        taxId: string | null;
        npwpPembeli: string | null;
        namaPembeli: string | null;
        nomorFaktur: string;
        nilaiDPP: import("@prisma/client/runtime/library").Decimal;
        nilaiPPN: import("@prisma/client/runtime/library").Decimal;
    }>;
    generateNomorFaktur(): Promise<string>;
    createEFaktur(data: {
        referenceId?: string;
        npwpPembeli?: string;
        namaPembeli?: string;
        nilaiDPP: number;
        nilaiPPN: number;
        taxId?: string;
        tanggal?: Date;
    }): Promise<{
        tax: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            accountId: string | null;
            nama: string;
            tipe: import("@prisma/client").$Enums.TaxType;
            kode: string;
            rate: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        status: import("@prisma/client").$Enums.EFakturStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        referenceId: string | null;
        taxId: string | null;
        npwpPembeli: string | null;
        namaPembeli: string | null;
        nomorFaktur: string;
        nilaiDPP: import("@prisma/client/runtime/library").Decimal;
        nilaiPPN: import("@prisma/client/runtime/library").Decimal;
    }>;
    createFromSaleInvoice(saleId: string): Promise<{
        tax: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            accountId: string | null;
            nama: string;
            tipe: import("@prisma/client").$Enums.TaxType;
            kode: string;
            rate: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        status: import("@prisma/client").$Enums.EFakturStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        referenceId: string | null;
        taxId: string | null;
        npwpPembeli: string | null;
        namaPembeli: string | null;
        nomorFaktur: string;
        nilaiDPP: import("@prisma/client/runtime/library").Decimal;
        nilaiPPN: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateStatus(id: string, status: EFakturStatus): Promise<{
        status: import("@prisma/client").$Enums.EFakturStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        referenceId: string | null;
        taxId: string | null;
        npwpPembeli: string | null;
        namaPembeli: string | null;
        nomorFaktur: string;
        nilaiDPP: import("@prisma/client/runtime/library").Decimal;
        nilaiPPN: import("@prisma/client/runtime/library").Decimal;
    }>;
    exportCSV(periode: string): Promise<string>;
    getRekapPPN(periode: string): Promise<{
        periode: string;
        ppnMasukan: {
            items: ({
                tax: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    isActive: boolean;
                    accountId: string | null;
                    nama: string;
                    tipe: import("@prisma/client").$Enums.TaxType;
                    kode: string;
                    rate: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                referenceId: string;
                tipe: import("@prisma/client").$Enums.TaxLineType;
                referenceType: string;
                taxId: string;
                baseAmount: import("@prisma/client/runtime/library").Decimal;
                taxAmount: import("@prisma/client/runtime/library").Decimal;
            })[];
            total: number;
        };
        ppnKeluaran: {
            items: ({
                tax: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    isActive: boolean;
                    accountId: string | null;
                    nama: string;
                    tipe: import("@prisma/client").$Enums.TaxType;
                    kode: string;
                    rate: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                id: string;
                createdAt: Date;
                referenceId: string;
                tipe: import("@prisma/client").$Enums.TaxLineType;
                referenceType: string;
                taxId: string;
                baseAmount: import("@prisma/client/runtime/library").Decimal;
                taxAmount: import("@prisma/client/runtime/library").Decimal;
            })[];
            total: number;
        };
        kurangLebih: number;
        status: string;
    }>;
    remove(id: string): Promise<{
        status: import("@prisma/client").$Enums.EFakturStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tanggal: Date;
        referenceId: string | null;
        taxId: string | null;
        npwpPembeli: string | null;
        namaPembeli: string | null;
        nomorFaktur: string;
        nilaiDPP: import("@prisma/client/runtime/library").Decimal;
        nilaiPPN: import("@prisma/client/runtime/library").Decimal;
    }>;
}
