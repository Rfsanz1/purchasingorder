import { AuditService } from './audit.service.js';
export declare class AuditController {
    private readonly svc;
    constructor(svc: AuditService);
    getLogs(q: any): Promise<{
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
    getHistory(t: string, r: string): Promise<{
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
}
