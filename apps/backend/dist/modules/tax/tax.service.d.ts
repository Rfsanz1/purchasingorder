import { PrismaService } from '../../database/prisma.service.js';
import { TaxLineType } from '@prisma/client';
import { CreateTaxDto, UpdateTaxDto } from './dto/create-tax.dto.js';
export interface PPNResult {
    dpp: number;
    ppn: number;
    total: number;
    rate: number;
}
export interface PPh21Result {
    grossSalary: number;
    ptkp: number;
    pkp: number;
    pph21Setahun: number;
    pph21Bulanan: number;
    statusPajak: string;
    rincianTarif: {
        lapisan: string;
        rate: number;
        jumlah: number;
    }[];
}
export interface PPh23Result {
    bruto: number;
    rate: number;
    pph23: number;
    jenis: string;
}
export interface PPh4a2Result {
    bruto: number;
    rate: number;
    pph4a2: number;
    jenis: string;
}
export declare class TaxService {
    private prisma;
    constructor(prisma: PrismaService);
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
    calculatePPN(amount: number, taxRate?: number): PPNResult;
    calculatePPh21(grossSalary: number, statusPajak: string): PPh21Result;
    calculatePPh23(amount: number, jenis: string): PPh23Result;
    calculatePPh4a2(amount: number, jenis: string): PPh4a2Result;
    createTaxLine(referenceId: string, referenceType: string, taxId: string, baseAmount: number, taxAmount: number, tipe: TaxLineType): Promise<{
        id: string;
        createdAt: Date;
        referenceId: string;
        tipe: import("@prisma/client").$Enums.TaxLineType;
        referenceType: string;
        taxId: string;
        baseAmount: import("@prisma/client/runtime/library").Decimal;
        taxAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    getTaxLinesByReference(referenceId: string): Promise<({
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
    })[]>;
    private formatCurrency;
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
}
