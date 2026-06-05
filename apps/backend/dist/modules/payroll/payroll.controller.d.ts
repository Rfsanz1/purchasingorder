import { PayrollService } from './payroll.service.js';
export declare class PayrollController {
    private readonly svc;
    constructor(svc: PayrollService);
    getPeriods(q: any): Promise<{
        data: ({
            _count: {
                slips: number;
            };
        } & {
            status: import("@prisma/client").$Enums.PayrollPeriodStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            bulan: number;
            tahun: number;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createPeriod(dto: any): Promise<{
        status: import("@prisma/client").$Enums.PayrollPeriodStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        bulan: number;
        tahun: number;
    }>;
    calculate(id: string): Promise<{
        processed: number;
        slips: any[];
    }>;
    calculateAll(id: string): Promise<{
        processed: number;
        slips: any[];
    }>;
    approve(id: string): Promise<{
        approved: number;
    }>;
    process(id: string): Promise<{
        paid: number;
        totalNet: number;
    }>;
    getSlips(q: any): Promise<{
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
            lines: ({
                component: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    isActive: boolean;
                    nama: string;
                    tipe: import("@prisma/client").$Enums.PayrollComponentType;
                    formula: string;
                };
            } & {
                id: string;
                createdAt: Date;
                deskripsi: string;
                componentId: string | null;
                amount: import("@prisma/client/runtime/library").Decimal;
                slipId: string;
            })[];
            period: {
                status: import("@prisma/client").$Enums.PayrollPeriodStatus;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                note: string | null;
                bulan: number;
                tahun: number;
            };
        } & {
            status: import("@prisma/client").$Enums.SlipStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            journalId: string | null;
            employeeId: string;
            bpjsKesEmployee: import("@prisma/client/runtime/library").Decimal;
            bpjsKesEmployer: import("@prisma/client/runtime/library").Decimal;
            periodId: string;
            gajiPokok: import("@prisma/client/runtime/library").Decimal;
            totalTunjangan: import("@prisma/client/runtime/library").Decimal;
            totalPotongan: import("@prisma/client/runtime/library").Decimal;
            bpjsTKEmployee: import("@prisma/client/runtime/library").Decimal;
            bpjsTKEmployer: import("@prisma/client/runtime/library").Decimal;
            totalPPh21: import("@prisma/client/runtime/library").Decimal;
            netSalary: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getSlip(id: string): Promise<{
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
        lines: ({
            component: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                nama: string;
                tipe: import("@prisma/client").$Enums.PayrollComponentType;
                formula: string;
            };
        } & {
            id: string;
            createdAt: Date;
            deskripsi: string;
            componentId: string | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            slipId: string;
        })[];
        period: {
            status: import("@prisma/client").$Enums.PayrollPeriodStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            bulan: number;
            tahun: number;
        };
    } & {
        status: import("@prisma/client").$Enums.SlipStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        journalId: string | null;
        employeeId: string;
        bpjsKesEmployee: import("@prisma/client/runtime/library").Decimal;
        bpjsKesEmployer: import("@prisma/client/runtime/library").Decimal;
        periodId: string;
        gajiPokok: import("@prisma/client/runtime/library").Decimal;
        totalTunjangan: import("@prisma/client/runtime/library").Decimal;
        totalPotongan: import("@prisma/client/runtime/library").Decimal;
        bpjsTKEmployee: import("@prisma/client/runtime/library").Decimal;
        bpjsTKEmployer: import("@prisma/client/runtime/library").Decimal;
        totalPPh21: import("@prisma/client/runtime/library").Decimal;
        netSalary: import("@prisma/client/runtime/library").Decimal;
    }>;
    getComponents(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        nama: string;
        tipe: import("@prisma/client").$Enums.PayrollComponentType;
        formula: string;
    }[]>;
    createComponent(dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        nama: string;
        tipe: import("@prisma/client").$Enums.PayrollComponentType;
        formula: string;
    }>;
    updateComponent(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        nama: string;
        tipe: import("@prisma/client").$Enums.PayrollComponentType;
        formula: string;
    }>;
    getBPJSConfig(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        bpjsKesEmployee: import("@prisma/client/runtime/library").Decimal;
        bpjsKesEmployer: import("@prisma/client/runtime/library").Decimal;
        bpjsTKJHTEmployee: import("@prisma/client/runtime/library").Decimal;
        bpjsTKJHTEmployer: import("@prisma/client/runtime/library").Decimal;
        bpjsTKJKK: import("@prisma/client/runtime/library").Decimal;
        bpjsTKJKM: import("@prisma/client/runtime/library").Decimal;
    }>;
    upsertBPJS(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        bpjsKesEmployee: import("@prisma/client/runtime/library").Decimal;
        bpjsKesEmployer: import("@prisma/client/runtime/library").Decimal;
        bpjsTKJHTEmployee: import("@prisma/client/runtime/library").Decimal;
        bpjsTKJHTEmployer: import("@prisma/client/runtime/library").Decimal;
        bpjsTKJKK: import("@prisma/client/runtime/library").Decimal;
        bpjsTKJKM: import("@prisma/client/runtime/library").Decimal;
    }>;
    bpjsReport(id: string): Promise<{
        rows: {
            nik: string;
            nama: string;
            gapok: number;
            bpjsKesEmployee: number;
            bpjsKesEmployer: number;
            bpjsTKEmployee: number;
            bpjsTKEmployer: number;
            totalEmployee: number;
            totalEmployer: number;
        }[];
        totals: {
            bpjsKesEmployee: number;
            bpjsKesEmployer: number;
            bpjsTKEmployee: number;
            bpjsTKEmployer: number;
            totalEmployee: number;
            totalEmployer: number;
        };
        period: {
            status: import("@prisma/client").$Enums.PayrollPeriodStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            bulan: number;
            tahun: number;
        };
    }>;
    pph21Report(id: string): Promise<{
        rows: {
            nik: string;
            nama: string;
            ptkpStatus: string;
            gajiPokok: number;
            pph21Bulan: number;
            pph21YTD: number;
        }[];
        period: {
            status: import("@prisma/client").$Enums.PayrollPeriodStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            bulan: number;
            tahun: number;
        };
        totalPph21Bulan: number;
    }>;
    summaryReport(id: string): Promise<{
        rows: {
            nik: string;
            nama: string;
            ptkpStatus: string;
            gajiPokok: number;
            pph21Bulan: number;
            pph21YTD: number;
        }[];
        period: {
            status: import("@prisma/client").$Enums.PayrollPeriodStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            bulan: number;
            tahun: number;
        };
        totalPph21Bulan: number;
    }>;
    bankExport(id: string, format?: string): Promise<{
        data: {
            nik: string;
            nama: string;
            netto: import("@prisma/client/runtime/library").Decimal;
        }[];
        format: string;
        message: string;
        meta: {
            total: number;
        };
    }>;
    sendSlipEmail(id: string): Promise<{
        data: any;
        message: string;
    }>;
    sendAllEmails(id: string): Promise<{
        data: any;
        message: string;
    }>;
}
