import { PrismaService } from '../../database/prisma.service.js';
export declare class JournalService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private genNomor;
    findAll(query: any): Promise<{
        data: ({
            lines: ({
                account: {
                    id: string;
                    name: string;
                    code: string;
                };
            } & {
                id: string;
                createdAt: Date;
                deskripsi: string | null;
                journalId: string;
                accountId: string;
                debit: import("@prisma/client/runtime/library").Decimal;
                kredit: import("@prisma/client/runtime/library").Decimal;
            })[];
        } & {
            status: import("@prisma/client").$Enums.JournalStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            referensi: string | null;
            deskripsi: string | null;
            nomor: string;
            tanggal: Date;
            createdById: string | null;
            reversalOf: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        lines: ({
            account: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                code: string;
                parentId: string | null;
                isActive: boolean;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                normalBalance: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string | null;
            journalId: string;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    createJournal(dto: any): Promise<{
        lines: ({
            account: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                code: string;
                parentId: string | null;
                isActive: boolean;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                normalBalance: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string | null;
            journalId: string;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    postJournal(id: string): Promise<{
        lines: ({
            account: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                code: string;
                parentId: string | null;
                isActive: boolean;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                normalBalance: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string | null;
            journalId: string;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    cancelJournal(id: string): Promise<{
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
    reverseJournal(id: string): Promise<{
        lines: ({
            account: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                type: import("@prisma/client").$Enums.AccountType;
                code: string;
                parentId: string | null;
                isActive: boolean;
                openingBalance: import("@prisma/client/runtime/library").Decimal;
                normalBalance: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string | null;
            journalId: string;
            accountId: string;
            debit: import("@prisma/client/runtime/library").Decimal;
            kredit: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        status: import("@prisma/client").$Enums.JournalStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        referensi: string | null;
        deskripsi: string | null;
        nomor: string;
        tanggal: Date;
        createdById: string | null;
        reversalOf: string | null;
    }>;
}
