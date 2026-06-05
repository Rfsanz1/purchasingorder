import { PrismaService } from '../../database/prisma.service.js';
import ExcelJS from 'exceljs';
export declare class FinancialReportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getBalancesUpTo;
    private getBalancesInPeriod;
    private _buildMap;
    private groupByType;
    getBalanceSheet(date?: string): Promise<{
        date: string;
        assets: {
            items: {
                id: any;
                code: any;
                name: any;
                type: any;
                balance: number;
            }[];
            total: number;
        };
        liabilities: {
            items: {
                id: any;
                code: any;
                name: any;
                type: any;
                balance: number;
            }[];
            total: number;
        };
        equity: {
            items: {
                id: any;
                code: any;
                name: any;
                type: any;
                balance: number;
            }[];
            total: number;
        };
        totalLiabilitiesAndEquity: number;
        isBalanced: boolean;
    }>;
    getIncomeStatement(dateFrom: string, dateTo: string, compare?: boolean): Promise<any>;
    getStatementOfEquity(dateFrom: string, dateTo: string): Promise<{
        period: {
            dateFrom: string;
            dateTo: string;
        };
        equity: {
            items: {
                id: any;
                code: any;
                name: any;
                type: any;
                balance: number;
            }[];
            total: number;
        };
        netIncome: any;
        beginningEquity: number;
        endingEquity: number;
    }>;
    getExecutiveSummary(dateFrom: string, dateTo: string): Promise<{
        period: {
            dateFrom: string;
            dateTo: string;
        };
        balanceSheet: {
            date: string;
            assets: {
                items: {
                    id: any;
                    code: any;
                    name: any;
                    type: any;
                    balance: number;
                }[];
                total: number;
            };
            liabilities: {
                items: {
                    id: any;
                    code: any;
                    name: any;
                    type: any;
                    balance: number;
                }[];
                total: number;
            };
            equity: {
                items: {
                    id: any;
                    code: any;
                    name: any;
                    type: any;
                    balance: number;
                }[];
                total: number;
            };
            totalLiabilitiesAndEquity: number;
            isBalanced: boolean;
        };
        incomeStatement: any;
        cashFlow: {
            period: {
                dateFrom: string;
                dateTo: string;
            };
            operating: {
                netIncome: any;
                adjustments: {
                    perubahanPiutang: number;
                    perubahanPersediaan: number;
                    perubahanHutangDagang: number;
                };
                total: number;
            };
            investing: {
                perubahanAsetTetap: number;
                total: number;
            };
            financing: {
                perubahanHutangBank: number;
                total: number;
            };
            netCashFlow: number;
        };
        metrics: {
            totalAssets: number;
            totalLiabilities: number;
            totalEquity: number;
            netIncome: any;
            cashFlow: number;
        };
    }>;
    private bufferFromPdf;
    private renderTableToSheet;
    private exportAsExcel;
    private exportAsPdf;
    exportReport(reportType: string, format: string, date?: string, dateFrom?: string, dateTo?: string, compare?: boolean): Promise<{
        buffer: Buffer<ArrayBufferLike>;
        filename: string;
        contentType: string;
    } | {
        buffer: ExcelJS.Buffer;
        filename: string;
        contentType: string;
    }>;
    getCashFlow(dateFrom: string, dateTo: string): Promise<{
        period: {
            dateFrom: string;
            dateTo: string;
        };
        operating: {
            netIncome: any;
            adjustments: {
                perubahanPiutang: number;
                perubahanPersediaan: number;
                perubahanHutangDagang: number;
            };
            total: number;
        };
        investing: {
            perubahanAsetTetap: number;
            total: number;
        };
        financing: {
            perubahanHutangBank: number;
            total: number;
        };
        netCashFlow: number;
    }>;
}
