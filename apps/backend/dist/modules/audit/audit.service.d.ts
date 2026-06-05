import { PrismaService } from '../../database/prisma.service.js';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    getAuditLog(filter: {
        tableName?: string;
        recordId?: string;
        actorId?: string;
        action?: string;
        dateFrom?: string;
        dateTo?: string;
        branchId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            actor: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            branchId: string | null;
            tableName: string | null;
            recordId: string | null;
            actorId: string | null;
            action: string;
            resource: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            oldData: import("@prisma/client/runtime/library").JsonValue | null;
            newData: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getRecordHistory(tableName: string, recordId: string): Promise<{
        version: number;
        diff: Record<string, {
            from: any;
            to: any;
        }>;
        actor: {
            id: string;
            email: string;
            name: string;
        };
        id: string;
        createdAt: Date;
        branchId: string | null;
        tableName: string | null;
        recordId: string | null;
        actorId: string | null;
        action: string;
        resource: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        oldData: import("@prisma/client/runtime/library").JsonValue | null;
        newData: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }[]>;
    logActivity(data: {
        actorId?: string;
        action: string;
        resource: string;
        tableName?: string;
        recordId?: string;
        oldData?: any;
        newData?: any;
        ipAddress?: string;
        userAgent?: string;
        branchId?: string;
        metadata?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        branchId: string | null;
        tableName: string | null;
        recordId: string | null;
        actorId: string | null;
        action: string;
        resource: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        oldData: import("@prisma/client/runtime/library").JsonValue | null;
        newData: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
    }>;
    private computeDiff;
}
