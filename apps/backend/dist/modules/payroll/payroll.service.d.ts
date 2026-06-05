import { PrismaService } from '../../database/prisma.service.js';
export declare class PayrollService {
    private prisma;
    constructor(prisma: PrismaService);
    getPeriods(query: any): Promise<{
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
    createPeriod(dto: {
        bulan: number;
        tahun: number;
        note?: string;
    }): Promise<{
        status: import("@prisma/client").$Enums.PayrollPeriodStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        bulan: number;
        tahun: number;
    }>;
    calculatePayroll(periodId: string): Promise<{
        processed: number;
        slips: any[];
    }>;
    approvePayroll(periodId: string): Promise<{
        approved: number;
    }>;
    processPayment(periodId: string): Promise<{
        paid: number;
        totalNet: number;
    }>;
    getSlips(query: any): Promise<{
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
    getBPJSReport(periodId: string): Promise<{
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
    getPPh21Report(periodId: string): Promise<{
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
    getBPJSConfig(employeeId: string): Promise<{
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
    upsertBPJSConfig(employeeId: string, dto: any): Promise<{
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
    bankExport(periodId: string, format?: string): Promise<{
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
    sendSlipEmail(slipId: string): Promise<{
        data: any;
        message: string;
    }>;
    sendAllSlipEmails(periodId: string): Promise<{
        data: any;
        message: string;
    }>;
    private findOrCreateAccountId;
}
