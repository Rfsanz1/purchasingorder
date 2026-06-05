import { HrService } from './hr.service.js';
export declare class HrController {
    private readonly svc;
    constructor(svc: HrService);
    getStats(): Promise<{
        total: number;
        aktif: number;
        cuti: number;
        nonaktif: number;
        totalGaji: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getEmployees(q: any): Promise<{
        data: {
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
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getEmployee(id: string): Promise<{
        payrolls: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            periode: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            potongan: import("@prisma/client/runtime/library").Decimal;
            netto: import("@prisma/client/runtime/library").Decimal;
        }[];
        attendances: {
            status: string;
            id: string;
            createdAt: Date;
            tanggal: Date;
            note: string | null;
            employeeId: string;
            checkIn: Date | null;
            checkOut: Date | null;
        }[];
    } & {
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
    }>;
    createEmployee(dto: any): Promise<{
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
    }>;
    updateEmployee(id: string, dto: any): Promise<{
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
    }>;
    deleteEmployee(id: string): Promise<{
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
    }>;
    getEmployeeHistory(id: string): Promise<{
        data: {
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
            contracts: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                notes: string | null;
                startDate: Date;
                endDate: Date | null;
                gapok: import("@prisma/client/runtime/library").Decimal;
                employeeId: string;
                tunjangan: import("@prisma/client/runtime/library").Decimal;
                tipeKontrak: string;
            }[];
            mutasi: {
                id: string;
                createdAt: Date;
                approvedBy: string | null;
                reason: string | null;
                employeeId: string;
                fromDepartemen: string | null;
                toDepartemen: string | null;
                fromJabatan: string | null;
                toJabatan: string | null;
                effectiveDate: Date;
            }[];
            attendances: {
                status: string;
                id: string;
                createdAt: Date;
                tanggal: Date;
                note: string | null;
                employeeId: string;
                checkIn: Date | null;
                checkOut: Date | null;
            }[];
            payrolls: {
                status: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                gapok: import("@prisma/client/runtime/library").Decimal;
                employeeId: string;
                periode: string;
                tunjangan: import("@prisma/client/runtime/library").Decimal;
                potongan: import("@prisma/client/runtime/library").Decimal;
                netto: import("@prisma/client/runtime/library").Decimal;
            }[];
        };
        message: string;
    }>;
    getPayrolls(q: any): Promise<{
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
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            periode: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            potongan: import("@prisma/client/runtime/library").Decimal;
            netto: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createPayroll(dto: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        gapok: import("@prisma/client/runtime/library").Decimal;
        employeeId: string;
        periode: string;
        tunjangan: import("@prisma/client/runtime/library").Decimal;
        potongan: import("@prisma/client/runtime/library").Decimal;
        netto: import("@prisma/client/runtime/library").Decimal;
    }>;
    updatePayroll(id: string, dto: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        gapok: import("@prisma/client/runtime/library").Decimal;
        employeeId: string;
        periode: string;
        tunjangan: import("@prisma/client/runtime/library").Decimal;
        potongan: import("@prisma/client/runtime/library").Decimal;
        netto: import("@prisma/client/runtime/library").Decimal;
    }>;
    getAttendances(q: any): Promise<{
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
        } & {
            status: string;
            id: string;
            createdAt: Date;
            tanggal: Date;
            note: string | null;
            employeeId: string;
            checkIn: Date | null;
            checkOut: Date | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createAttendance(dto: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        tanggal: Date;
        note: string | null;
        employeeId: string;
        checkIn: Date | null;
        checkOut: Date | null;
    }>;
    importAttendanceCsv(dto: {
        rows: any[];
    }): Promise<{
        data: any[];
        message: string;
    }>;
    getAttendanceReport(q: any): Promise<{
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
        month: number;
        year: number;
        attendances: {
            status: string;
            id: string;
            createdAt: Date;
            tanggal: Date;
            note: string | null;
            employeeId: string;
            checkIn: Date | null;
            checkOut: Date | null;
        }[];
        stats: {
            hadir: number;
            terlambat: number;
            cuti: number;
            sakit: number;
            izin: number;
            tanpaKeterangan: number;
        };
    }>;
    getAttendanceSummary(q: any): Promise<{
        month: number;
        year: number;
        summary: {
            employeeId: string;
            employeeName: any;
            nik: any;
            departemen: any;
            hadir: number;
            terlambat: number;
            cuti: number;
            sakit: number;
            izin: number;
            tanpaKeterangan: number;
        }[];
    }>;
    getShifts(q: any): Promise<{
        data: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            nama: string;
            jamMasuk: string;
            jamKeluar: string;
            toleransi: number;
        }[];
        message: string;
    }>;
    createShift(dto: any): Promise<{
        data: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            nama: string;
            jamMasuk: string;
            jamKeluar: string;
            toleransi: number;
        };
        message: string;
    }>;
    updateShift(id: string, dto: any): Promise<{
        data: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            nama: string;
            jamMasuk: string;
            jamKeluar: string;
            toleransi: number;
        };
        message: string;
    }>;
    deleteShift(id: string): Promise<{
        data: any;
        message: string;
    }>;
    assignShift(employeeId: string, dto: {
        shiftId: string;
    }): Promise<{
        message: string;
        employee: {
            id: string;
            name: string;
        };
        shift: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            nama: string;
            jamMasuk: string;
            jamKeluar: string;
            toleransi: number;
        };
    }>;
    getMutasi(q: any): Promise<{
        data: ({
            employee: {
                id: string;
                name: string;
                nik: string;
            };
        } & {
            id: string;
            createdAt: Date;
            approvedBy: string | null;
            reason: string | null;
            employeeId: string;
            fromDepartemen: string | null;
            toDepartemen: string | null;
            fromJabatan: string | null;
            toJabatan: string | null;
            effectiveDate: Date;
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    createMutasi(dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            approvedBy: string | null;
            reason: string | null;
            employeeId: string;
            fromDepartemen: string | null;
            toDepartemen: string | null;
            fromJabatan: string | null;
            toJabatan: string | null;
            effectiveDate: Date;
        };
        message: string;
    }>;
    getLeaveTypes(): Promise<{
        data: {
            id: string;
            name: string;
            active: boolean;
            requiresApproval: boolean;
            maxDays: number | null;
        }[];
    }>;
    createLeaveType(dto: any): Promise<{
        data: {
            id: string;
            name: string;
            active: boolean;
            requiresApproval: boolean;
            maxDays: number | null;
        };
        message: string;
    }>;
    getLeaveRequests(q: any): Promise<{
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
    }>;
    createLeaveRequest(dto: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    approveLeaveRequest(id: string, dto: {
        approvedBy: string;
    }): Promise<{
        data: {
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
        };
        message: string;
    }>;
    rejectLeaveRequest(id: string, dto: {
        reason?: string;
    }): Promise<{
        data: {
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
        };
        message: string;
    }>;
    getLeaveAllocations(q: any): Promise<{
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
            employeeId: string;
            leaveTypeId: string;
            numberOfDays: import("@prisma/client/runtime/library").Decimal;
            year: number;
        })[];
    }>;
    createLeaveAllocation(dto: any): Promise<{
        data: {
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
        };
        message: string;
    }>;
    getLeaveBalance(employeeId: string, year?: string): Promise<{
        employeeId: string;
        year: number;
        balance: {
            leaveType: {
                id: string;
                name: string;
                active: boolean;
                requiresApproval: boolean;
                maxDays: number | null;
            };
            allocated: number;
            used: number;
            balance: number;
        }[];
    }>;
    getLeaveCalendar(q: any): Promise<{
        month: number;
        year: number;
        leaves: ({
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
    }>;
    getContracts(q: any): Promise<{
        data: ({
            employee: {
                id: string;
                name: string;
                nik: string;
            };
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            startDate: Date;
            endDate: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            tipeKontrak: string;
        })[];
        message: string;
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;
    getContract(id: string): Promise<{
        data: {
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
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            startDate: Date;
            endDate: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            tipeKontrak: string;
        };
        message: string;
    }>;
    createContract(dto: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            startDate: Date;
            endDate: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            tipeKontrak: string;
        };
        message: string;
    }>;
    updateContract(id: string, dto: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            startDate: Date;
            endDate: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            tipeKontrak: string;
        };
        message: string;
    }>;
    deleteContract(id: string): Promise<{
        data: any;
        message: string;
    }>;
    getEmployeeContracts(employeeId: string): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            startDate: Date;
            endDate: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            tipeKontrak: string;
        }[];
    }>;
    createEmployeeContract(employeeId: string, dto: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            startDate: Date;
            endDate: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            tipeKontrak: string;
        };
        message: string;
    }>;
    updateEmployeeContract(contractId: string, dto: any): Promise<{
        data: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            startDate: Date;
            endDate: Date | null;
            gapok: import("@prisma/client/runtime/library").Decimal;
            employeeId: string;
            tunjangan: import("@prisma/client/runtime/library").Decimal;
            tipeKontrak: string;
        };
        message: string;
    }>;
    transferEmployee(employeeId: string, dto: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            approvedBy: string | null;
            reason: string | null;
            employeeId: string;
            fromDepartemen: string | null;
            toDepartemen: string | null;
            fromJabatan: string | null;
            toJabatan: string | null;
            effectiveDate: Date;
        };
        message: string;
    }>;
    getTransferHistory(employeeId: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            approvedBy: string | null;
            reason: string | null;
            employeeId: string;
            fromDepartemen: string | null;
            toDepartemen: string | null;
            fromJabatan: string | null;
            toJabatan: string | null;
            effectiveDate: Date;
        }[];
    }>;
    importCsv(dto: {
        rows: any[];
    }): Promise<{
        data: any[];
        message: string;
    }>;
}
