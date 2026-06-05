import { PrismaService } from '../../database/prisma.service.js';
export declare class JournalRecurringService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private genNomor;
    private normalizeFrequency;
    private nextRunDate;
    private validateLines;
    findAll(query: any): Promise<{
        data: ({
            lines: {
                id: string;
                deskripsi: string | null;
                accountId: string;
                debit: import("@prisma/client/runtime/library").Decimal;
                kredit: import("@prisma/client/runtime/library").Decimal;
                journalRecurringId: string;
            }[];
        } & {
            status: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            createdById: string | null;
            journalId: string | null;
            startDate: Date;
            endDate: Date | null;
            frequency: string;
            interval: number;
            nextRunAt: Date;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        lines: {
            id: string;
            deskripsi: string | null;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
            journalRecurringId: string;
        }[];
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        journalId: string | null;
        startDate: Date;
        endDate: Date | null;
        frequency: string;
        interval: number;
        nextRunAt: Date;
    }>;
    create(dto: any): Promise<{
        lines: {
            id: string;
            deskripsi: string | null;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
            journalRecurringId: string;
        }[];
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        journalId: string | null;
        startDate: Date;
        endDate: Date | null;
        frequency: string;
        interval: number;
        nextRunAt: Date;
    }>;
    update(id: string, dto: any): Promise<{
        lines: {
            id: string;
            deskripsi: string | null;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
            journalRecurringId: string;
        }[];
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        createdById: string | null;
        journalId: string | null;
        startDate: Date;
        endDate: Date | null;
        frequency: string;
        interval: number;
        nextRunAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    runDueRecurring(id?: string): Promise<{
        message: string;
        results?: undefined;
    } | {
        message: string;
        results: any[];
    }>;
}
