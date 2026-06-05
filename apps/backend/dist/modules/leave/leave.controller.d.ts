import { LeaveService } from './leave.service.js';
export declare class LeaveController {
    private readonly svc;
    constructor(svc: LeaveService);
    getStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
    }>;
    getTypes(): Promise<{
        id: string;
        name: string;
        active: boolean;
        requiresApproval: boolean;
        maxDays: number | null;
    }[]>;
    createType(dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        requiresApproval: boolean;
        maxDays: number | null;
    }>;
    getAllocations(q: any): Promise<({
        employee: {
            status: string;
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            phone: string | null;
            departemen: string | null;
            nik: string;
            jabatan: string | null;
            tanggalMasuk: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            ptkpStatus: string;
        };
        leaveType: {
            id: string;
            name: string;
            active: boolean;
            requiresApproval: boolean;
            maxDays: number | null;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        employeeId: string;
        leaveTypeId: string;
        numberOfDays: import("@prisma/client/runtime/library").Decimal;
        year: number;
    })[]>;
    createAllocation(dto: any): Promise<{
        employee: {
            status: string;
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            phone: string | null;
            departemen: string | null;
            nik: string;
            jabatan: string | null;
            tanggalMasuk: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            ptkpStatus: string;
        };
        leaveType: {
            id: string;
            name: string;
            active: boolean;
            requiresApproval: boolean;
            maxDays: number | null;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        employeeId: string;
        leaveTypeId: string;
        numberOfDays: import("@prisma/client/runtime/library").Decimal;
        year: number;
    }>;
    getRequests(q: any): Promise<{
        data: ({
            employee: {
                status: string;
                id: string;
                email: string | null;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                phone: string | null;
                departemen: string | null;
                nik: string;
                jabatan: string | null;
                tanggalMasuk: Date | null;
                gapok: import("@prisma/client/runtime/library").Decimal;
                ptkpStatus: string;
            };
            leaveType: {
                id: string;
                name: string;
                active: boolean;
                requiresApproval: boolean;
                maxDays: number | null;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            dateFrom: Date;
            dateTo: Date;
            approvedBy: string | null;
            reason: string | null;
            approvedAt: Date | null;
            employeeId: string;
            leaveTypeId: string;
            numberOfDays: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createRequest(dto: any): Promise<{
        employee: {
            status: string;
            id: string;
            email: string | null;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string | null;
            phone: string | null;
            departemen: string | null;
            nik: string;
            jabatan: string | null;
            tanggalMasuk: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            ptkpStatus: string;
        };
        leaveType: {
            id: string;
            name: string;
            active: boolean;
            requiresApproval: boolean;
            maxDays: number | null;
        };
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateFrom: Date;
        dateTo: Date;
        approvedBy: string | null;
        reason: string | null;
        approvedAt: Date | null;
        employeeId: string;
        leaveTypeId: string;
        numberOfDays: import("@prisma/client/runtime/library").Decimal;
    }>;
    approveRequest(id: string, user: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateFrom: Date;
        dateTo: Date;
        approvedBy: string | null;
        reason: string | null;
        approvedAt: Date | null;
        employeeId: string;
        leaveTypeId: string;
        numberOfDays: import("@prisma/client/runtime/library").Decimal;
    }>;
    refuseRequest(id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        dateFrom: Date;
        dateTo: Date;
        approvedBy: string | null;
        reason: string | null;
        approvedAt: Date | null;
        employeeId: string;
        leaveTypeId: string;
        numberOfDays: import("@prisma/client/runtime/library").Decimal;
    }>;
    getBalance(empId: string, year: string): Promise<{
        leaveType: string;
        allocated: number;
        taken: number;
        remaining: number;
    }[]>;
}
