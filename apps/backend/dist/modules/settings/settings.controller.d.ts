import { SettingsService } from './settings.service.js';
export declare class SettingsController {
    private readonly svc;
    constructor(svc: SettingsService);
    getAll(): Promise<{
        [k: string]: string;
    }>;
    update(dto: Record<string, string>): Promise<{
        [k: string]: string;
    }>;
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
    updateDocumentNumber(module: string, dto: any): Promise<{
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
    updateSmtp(dto: any): Promise<{
        data: any;
        message: string;
    }>;
    testSmtp(dto: {
        to: string;
    }): Promise<{
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
