import { TaxType } from '@prisma/client';
export declare class CreateTaxDto {
    kode: string;
    nama: string;
    tipe: TaxType;
    rate: number;
    isActive?: boolean;
    accountId?: string;
}
export declare class UpdateTaxDto {
    nama?: string;
    tipe?: TaxType;
    rate?: number;
    isActive?: boolean;
    accountId?: string;
}
export declare class CalculatePPNDto {
    amount: number;
    taxRate?: number;
}
export declare class CalculatePPh21Dto {
    grossSalary: number;
    statusPajak: string;
}
export declare class CalculatePPh23Dto {
    amount: number;
    jenis: string;
}
export declare class CalculatePPh4a2Dto {
    amount: number;
    jenis: string;
}
export declare class ExportEFakturDto {
    periode: string;
}
export declare class RekapPPNDto {
    periode: string;
}
