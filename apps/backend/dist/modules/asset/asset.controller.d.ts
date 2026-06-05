import { AssetService } from './asset.service.js';
export declare class AssetController {
    private readonly svc;
    constructor(svc: AssetService);
    getAssets(q: any): Promise<{
        data: {
            nilaiBuku: number;
            akumDepresiasi: number;
            depreciations: {
                id: string;
                createdAt: Date;
                journalId: string | null;
                bulan: number;
                tahun: number;
                assetId: string;
                bebanDepresiasi: import("@prisma/client/runtime/library").Decimal;
                akumDepresiasi: import("@prisma/client/runtime/library").Decimal;
                nilaiBuku: import("@prisma/client/runtime/library").Decimal;
            }[];
            status: import("@prisma/client").$Enums.AssetStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            nama: string;
            kode: string;
            branchId: string | null;
            kategori: string;
            tanggalPerolehan: Date;
            nilaiPerolehan: import("@prisma/client/runtime/library").Decimal;
            nilaiResidu: import("@prisma/client/runtime/library").Decimal;
            umurEkonomi: number;
            metodeDepresiasi: import("@prisma/client").$Enums.DepreciasiMethod;
            accountAssetId: string | null;
            accountDepreciasiId: string | null;
            accountAkumDepId: string | null;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getRegister(d?: string): Promise<{
        kode: string;
        nama: string;
        kategori: string;
        tanggalPerolehan: Date;
        nilaiPerolehan: number;
        nilaiResidu: number;
        akumDepresiasi: number;
        nilaiBuku: number;
        umurEkonomi: number;
        metode: import("@prisma/client").$Enums.DepreciasiMethod;
    }[]>;
    getKategori(): Promise<string[]>;
    getAsset(id: string): Promise<{
        nilaiBuku: number;
        akumDepresiasi: number;
        depreciations: {
            id: string;
            createdAt: Date;
            journalId: string | null;
            bulan: number;
            tahun: number;
            assetId: string;
            bebanDepresiasi: import("@prisma/client/runtime/library").Decimal;
            akumDepresiasi: import("@prisma/client/runtime/library").Decimal;
            nilaiBuku: import("@prisma/client/runtime/library").Decimal;
        }[];
        status: import("@prisma/client").$Enums.AssetStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        nama: string;
        kode: string;
        branchId: string | null;
        kategori: string;
        tanggalPerolehan: Date;
        nilaiPerolehan: import("@prisma/client/runtime/library").Decimal;
        nilaiResidu: import("@prisma/client/runtime/library").Decimal;
        umurEkonomi: number;
        metodeDepresiasi: import("@prisma/client").$Enums.DepreciasiMethod;
        accountAssetId: string | null;
        accountDepreciasiId: string | null;
        accountAkumDepId: string | null;
    }>;
    createAsset(dto: any): Promise<{
        status: import("@prisma/client").$Enums.AssetStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        nama: string;
        kode: string;
        branchId: string | null;
        kategori: string;
        tanggalPerolehan: Date;
        nilaiPerolehan: import("@prisma/client/runtime/library").Decimal;
        nilaiResidu: import("@prisma/client/runtime/library").Decimal;
        umurEkonomi: number;
        metodeDepresiasi: import("@prisma/client").$Enums.DepreciasiMethod;
        accountAssetId: string | null;
        accountDepreciasiId: string | null;
        accountAkumDepId: string | null;
    }>;
    updateAsset(id: string, d: any): Promise<{
        status: import("@prisma/client").$Enums.AssetStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        nama: string;
        kode: string;
        branchId: string | null;
        kategori: string;
        tanggalPerolehan: Date;
        nilaiPerolehan: import("@prisma/client/runtime/library").Decimal;
        nilaiResidu: import("@prisma/client/runtime/library").Decimal;
        umurEkonomi: number;
        metodeDepresiasi: import("@prisma/client").$Enums.DepreciasiMethod;
        accountAssetId: string | null;
        accountDepreciasiId: string | null;
        accountAkumDepId: string | null;
    }>;
    getSchedule(id: string): Promise<{
        asset: {
            status: import("@prisma/client").$Enums.AssetStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            nama: string;
            kode: string;
            branchId: string | null;
            kategori: string;
            tanggalPerolehan: Date;
            nilaiPerolehan: import("@prisma/client/runtime/library").Decimal;
            nilaiResidu: import("@prisma/client/runtime/library").Decimal;
            umurEkonomi: number;
            metodeDepresiasi: import("@prisma/client").$Enums.DepreciasiMethod;
            accountAssetId: string | null;
            accountDepreciasiId: string | null;
            accountAkumDepId: string | null;
        };
        schedule: any[];
    }>;
    dispose(id: string, dto: any): Promise<{
        gainLoss: number;
        nilaiBuku: number;
        nilaiDisposal: number;
        status: string;
    }>;
    runDepreciation(dto: {
        bulan: number;
        tahun: number;
    }): Promise<{
        processed: number;
        results: any[];
    }>;
    calcDepreciation(dto: {
        assetId: string;
        bulan: number;
        tahun: number;
    }): Promise<{
        beban: number;
        akumDepresiasi: number;
        nilaiBuku: number;
        bulan: number;
        tahun: number;
    }>;
}
