var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let LedgerService = class LedgerService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGeneralLedger(accountId, dateFrom, dateTo) {
        const account = await this.prisma.account.findUnique({ where: { id: accountId } });
        if (!account)
            throw new NotFoundException(`Akun ${accountId} tidak ditemukan`);
        // Saldo awal: semua jurnal POSTED sebelum dateFrom
        const openWhere = { accountId, journal: { status: 'POSTED' } };
        if (dateFrom)
            openWhere.journal.tanggal = { lt: new Date(dateFrom) };
        const openAgg = await this.prisma.journalLine.aggregate({
            where: openWhere,
            _sum: { debit: true, kredit: true },
        });
        const openD = Number(openAgg._sum.debit || 0);
        const openK = Number(openAgg._sum.kredit || 0);
        const openingBalance = account.normalBalance === 'DEBIT' ? openD - openK : openK - openD;
        // Mutasi dalam periode
        const mutWhere = { accountId, journal: { status: 'POSTED' } };
        if (dateFrom || dateTo) {
            mutWhere.journal.tanggal = {};
            if (dateFrom)
                mutWhere.journal.tanggal.gte = new Date(dateFrom);
            if (dateTo)
                mutWhere.journal.tanggal.lte = new Date(dateTo);
        }
        const mutations = await this.prisma.journalLine.findMany({
            where: mutWhere,
            include: { journal: { select: { nomor: true, tanggal: true, deskripsi: true } } },
            orderBy: { journal: { tanggal: 'asc' } },
        });
        let running = openingBalance;
        const lines = mutations.map((m) => {
            const d = Number(m.debit);
            const k = Number(m.kredit);
            running =
                account.normalBalance === 'DEBIT'
                    ? running + d - k
                    : running - d + k;
            return {
                date: m.journal.tanggal,
                nomor: m.journal.nomor,
                deskripsi: m.deskripsi || m.journal.deskripsi,
                debit: d,
                kredit: k,
                balance: running,
            };
        });
        const totalDebit = mutations.reduce((s, m) => s + Number(m.debit), 0);
        const totalKredit = mutations.reduce((s, m) => s + Number(m.kredit), 0);
        const closingBalance = account.normalBalance === 'DEBIT'
            ? openingBalance + totalDebit - totalKredit
            : openingBalance - totalDebit + totalKredit;
        return {
            account: { id: account.id, code: account.code, name: account.name, type: account.type },
            period: { dateFrom, dateTo },
            openingBalance,
            lines,
            totalDebit,
            totalKredit,
            closingBalance,
        };
    }
    async getTrialBalance(dateFrom, dateTo) {
        const accounts = await this.prisma.account.findMany({
            where: { isActive: true },
            orderBy: { code: 'asc' },
        });
        const whereDate = { journal: { status: 'POSTED' } };
        if (dateFrom || dateTo) {
            whereDate.journal.tanggal = {};
            if (dateFrom)
                whereDate.journal.tanggal.gte = new Date(dateFrom);
            if (dateTo)
                whereDate.journal.tanggal.lte = new Date(dateTo);
        }
        const rows = await Promise.all(accounts.map(async (acc) => {
            const agg = await this.prisma.journalLine.aggregate({
                where: { ...whereDate, accountId: acc.id },
                _sum: { debit: true, kredit: true },
            });
            const d = Number(agg._sum.debit || 0);
            const k = Number(agg._sum.kredit || 0);
            const balance = acc.normalBalance === 'DEBIT' ? d - k : k - d;
            return {
                accountId: acc.id,
                code: acc.code,
                name: acc.name,
                type: acc.type,
                normalBalance: acc.normalBalance,
                totalDebit: d,
                totalKredit: k,
                balance,
                debitBalance: balance > 0 && acc.normalBalance === 'DEBIT' ? balance : (balance < 0 ? Math.abs(balance) : 0),
                creditBalance: balance > 0 && acc.normalBalance === 'CREDIT' ? balance : (balance < 0 && acc.normalBalance === 'DEBIT' ? Math.abs(balance) : 0),
            };
        }));
        const active = rows.filter((r) => r.totalDebit > 0 || r.totalKredit > 0);
        const totals = active.reduce((acc, r) => ({
            totalDebit: acc.totalDebit + r.totalDebit,
            totalKredit: acc.totalKredit + r.totalKredit,
            totalDebitBalance: acc.totalDebitBalance + r.debitBalance,
            totalCreditBalance: acc.totalCreditBalance + r.creditBalance,
        }), { totalDebit: 0, totalKredit: 0, totalDebitBalance: 0, totalCreditBalance: 0 });
        return { period: { dateFrom, dateTo }, accounts: active, totals };
    }
};
LedgerService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], LedgerService);
export { LedgerService };
