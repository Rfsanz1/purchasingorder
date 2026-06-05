import { PrismaService } from '../../database/prisma.service.js';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<{
        [k: string]: string;
    }>;
    update(data: Record<string, string>): Promise<{
        [k: string]: string;
    }>;
    get(key: string): Promise<string>;
    getDocumentNumbers(): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            docType: string;
            prefix: string;
            separator: string;
            useYear: boolean;
            useMonth: boolean;
            padLength: number;
            lastSeq: number;
        }[];
        message: string;
    }>;
    updateDocumentNumber(docType: string, dto: {
        prefix?: string;
        separator?: string;
        useYear?: boolean;
        useMonth?: boolean;
        padLength?: number;
        lastSeq?: number;
    }): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            docType: string;
            prefix: string;
            separator: string;
            useYear: boolean;
            useMonth: boolean;
            padLength: number;
            lastSeq: number;
        };
        message: string;
    }>;
    getSmtp(): Promise<{
        data: any;
        message: string;
    }>;
    updateSmtp(dto: {
        host: string;
        port: number;
        username: string;
        password?: string;
        fromEmail: string;
        fromName?: string;
        secure?: boolean;
    }): Promise<{
        data: any;
        message: string;
    }>;
    testSmtp(to: string): Promise<{
        data: any;
        message: string;
    }>;
    getFiscalYear(): Promise<{
        data: {
            startMonth: number;
            startYear: number;
        };
        message: string;
    }>;
    updateFiscalYear(dto: {
        startMonth: number;
        startYear: number;
    }): Promise<{
        data: {
            startMonth: number;
            startYear: number;
        };
        message: string;
    }>;
}
