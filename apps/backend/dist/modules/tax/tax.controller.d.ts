import { Response } from 'express';
import { TaxService } from './tax.service.js';
import { EFakturService } from './efaktur.service.js';
import { CreateTaxDto, UpdateTaxDto, CalculatePPNDto, CalculatePPh21Dto, CalculatePPh23Dto, CalculatePPh4a2Dto } from './dto/create-tax.dto.js';
import { EFakturStatus } from '@prisma/client';
export declare class TaxController {
    private readonly taxService;
    private readonly efakturService;
    constructor(taxService: TaxService, efakturService: EFakturService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        accountId: string | null;
        nama: string;
        tipe: import("@prisma/client").$Enums.TaxType;
        kode: string;
        rate: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    getPTKPOptions(): {
        status: string;
        nilai: number;
    }[];
    getPPh23Options(): {
        jenis: string;
        rate: number;
    }[];
    getPPh4a2Options(): {
        jenis: string;
        rate: number;
    }[];
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        accountId: string | null;
        nama: string;
        tipe: import("@prisma/client").$Enums.TaxType;
        kode: string;
        rate: import("@prisma/client/runtime/library").Decimal;
    }>;
    create(dto: CreateTaxDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        accountId: string | null;
        nama: string;
        tipe: import("@prisma/client").$Enums.TaxType;
        kode: string;
        rate: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: string, dto: UpdateTaxDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        accountId: string | null;
        nama: string;
        tipe: import("@prisma/client").$Enums.TaxType;
        kode: string;
        rate: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        accountId: string | null;
        nama: string;
        tipe: import("@prisma/client").$Enums.TaxType;
        kode: string;
        rate: import("@prisma/client/runtime/library").Decimal;
    }>;
    calculatePPN(dto: CalculatePPNDto): import("./tax.service.js").PPNResult;
    calculatePPh21(dto: CalculatePPh21Dto): import("./tax.service.js").PPh21Result;
    calculatePPh23(dto: CalculatePPh23Dto): import("./tax.service.js").PPh23Result;
    calculatePPh4a2(dto: CalculatePPh4a2Dto): import("./tax.service.js").PPh4a2Result;
    getEFakturList(periode?: string): Promise<({
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
    exportCSV(periode: string, res: Response): Promise<void>;
    getEFaktur(id: string): Promise<{
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
    createEFaktur(body: {
        referenceId?: string;
        npwpPembeli?: string;
        namaPembeli?: string;
        nilaiDPP: number;
        nilaiPPN: number;
        taxId?: string;
        tanggal?: string;
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
    createFromSale(saleId: string): Promise<{
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
    updateEFakturStatus(id: string, status: EFakturStatus): Promise<{
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
    deleteEFaktur(id: string): Promise<{
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
