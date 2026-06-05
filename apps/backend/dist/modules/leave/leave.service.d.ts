import { PrismaService } from '../../database/prisma.service.js';
export declare class LeaveService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getLeaveTypes(): Promise<{
        id: string;
        name: string;
        active: boolean;
        requiresApproval: boolean;
        maxDays: number | null;
    }[]>;
    createLeaveType(dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        requiresApproval: boolean;
        maxDays: number | null;
    }>;
    getAllocations(query: any): Promise<({
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
    getRequests(query: any): Promise<{
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
    approveRequest(id: string, approvedBy: string): Promise<{
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
    getLeaveBalance(employeeId: string, year: number): Promise<{
        leaveType: string;
        allocated: number;
        taken: number;
        remaining: number;
    }[]>;
    getStats(): Promise<{
        total: number;
        pending: number;
        approved: number;
    }>;
}
