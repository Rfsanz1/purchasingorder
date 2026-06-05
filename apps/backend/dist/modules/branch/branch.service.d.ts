import { PrismaService } from '../../database/prisma.service.js';
export declare class BranchService {
    private prisma;
    constructor(prisma: PrismaService);
    getCompanies(): Promise<({
        branches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            nama: string;
            kode: string;
            alamat: string | null;
            companyId: string;
            isHeadOffice: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nama: string;
        npwp: string | null;
        alamat: string | null;
        logo: string | null;
        defaultCurrency: string;
        timezone: string;
    })[]>;
    getCompany(id: string): Promise<{
        branches: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            nama: string;
            kode: string;
            alamat: string | null;
            companyId: string;
            isHeadOffice: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nama: string;
        npwp: string | null;
        alamat: string | null;
        logo: string | null;
        defaultCurrency: string;
        timezone: string;
    }>;
    upsertCompany(dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        nama: string;
        npwp: string | null;
        alamat: string | null;
        logo: string | null;
        defaultCurrency: string;
        timezone: string;
    }>;
    getBranches(companyId?: string): Promise<({
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nama: string;
            npwp: string | null;
            alamat: string | null;
            logo: string | null;
            defaultCurrency: string;
            timezone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        nama: string;
        kode: string;
        alamat: string | null;
        companyId: string;
        isHeadOffice: boolean;
    })[]>;
    getBranch(id: string): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nama: string;
            npwp: string | null;
            alamat: string | null;
            logo: string | null;
            defaultCurrency: string;
            timezone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        nama: string;
        kode: string;
        alamat: string | null;
        companyId: string;
        isHeadOffice: boolean;
    }>;
    createBranch(dto: any): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nama: string;
            npwp: string | null;
            alamat: string | null;
            logo: string | null;
            defaultCurrency: string;
            timezone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        nama: string;
        kode: string;
        alamat: string | null;
        companyId: string;
        isHeadOffice: boolean;
    }>;
    updateBranch(id: string, dto: any): Promise<{
        company: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            nama: string;
            npwp: string | null;
            alamat: string | null;
            logo: string | null;
            defaultCurrency: string;
            timezone: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        nama: string;
        kode: string;
        alamat: string | null;
        companyId: string;
        isHeadOffice: boolean;
    }>;
    deleteBranch(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        nama: string;
        kode: string;
        alamat: string | null;
        companyId: string;
        isHeadOffice: boolean;
    }>;
}
