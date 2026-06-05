import { QualityService } from './quality.service.js';
export declare class QualityController {
    private readonly svc;
    constructor(svc: QualityService);
    getStats(): Promise<{
        totalChecks: number;
        passed: number;
        failed: number;
        pending: number;
        totalAlerts: number;
    }>;
    getQcps(q: any): Promise<({
        _count: {
            checks: number;
        };
    } & {
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        productId: string | null;
        operation: string;
        checkType: string;
    })[]>;
    createQcp(dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        productId: string | null;
        operation: string;
        checkType: string;
    }>;
    updateQcp(id: string, dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        productId: string | null;
        operation: string;
        checkType: string;
    }>;
    getChecks(q: any): Promise<{
        data: ({
            qcp: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                productId: string | null;
                operation: string;
                checkType: string;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            notes: string | null;
            qcpId: string;
            measuredValue: import("@prisma/client/runtime/library").Decimal | null;
            picturePath: string | null;
            doneAt: Date | null;
            doneBy: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createCheck(dto: any): Promise<{
        qcp: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            productId: string | null;
            operation: string;
            checkType: string;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        notes: string | null;
        qcpId: string;
        measuredValue: import("@prisma/client/runtime/library").Decimal | null;
        picturePath: string | null;
        doneAt: Date | null;
        doneBy: string | null;
    }>;
    passCheck(id: string, val: number): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        notes: string | null;
        qcpId: string;
        measuredValue: import("@prisma/client/runtime/library").Decimal | null;
        picturePath: string | null;
        doneAt: Date | null;
        doneBy: string | null;
    }>;
    failCheck(id: string, notes: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        notes: string | null;
        qcpId: string;
        measuredValue: import("@prisma/client/runtime/library").Decimal | null;
        picturePath: string | null;
        doneAt: Date | null;
        doneBy: string | null;
    }>;
    getAlerts(q: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            productId: string | null;
            stage: string;
            priority: number;
            rootCause: string | null;
            corrective: string | null;
        }[];
        total: number;
    }>;
    createAlert(dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        productId: string | null;
        stage: string;
        priority: number;
        rootCause: string | null;
        corrective: string | null;
    }>;
    updateAlert(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        productId: string | null;
        stage: string;
        priority: number;
        rootCause: string | null;
        corrective: string | null;
    }>;
}
