import { PrismaService } from '../../database/prisma.service.js';
export declare class AccountService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<({
        parent: {
            id: string;
            name: string;
            code: string;
        };
    } & {
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
    })[]>;
    getTree(): Promise<any[]>;
    findOne(id: string): Promise<{
        parent: {
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
        children: {
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
        }[];
    } & {
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
    }>;
    create(dto: any): Promise<{
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
    }>;
    update(id: string, dto: any): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    validateKodeUnik(code: string): Promise<void>;
}
