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
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AutoJournalService } from './auto-journal.service.js';
let FinanceService = class FinanceService {
    prisma;
    autoJournal;
    constructor(prisma, autoJournal) {
        this.prisma = prisma;
        this.autoJournal = autoJournal;
    }
    async getJournalEntries(query) {
        const { search, status, type, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search)
            where.noJurnal = { contains: search, mode: 'insensitive' };
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        const [data, total] = await Promise.all([
            this.prisma.journalEntry.findMany({
                where, skip, take: Number(limit),
                include: { lines: { include: { coa: true } } },
                orderBy: { tanggal: 'desc' },
            }),
            this.prisma.journalEntry.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async createJournalEntry(dto) {
        const { lines, ...data } = dto;
        const noJurnal = `JRN/${new Date().getFullYear()}/${String(Date.now()).slice(-5)}`;
        return this.prisma.journalEntry.create({
            data: { ...data, noJurnal, lines: { create: lines ?? [] } },
            include: { lines: true },
        });
    }
    async getCoa(query) {
        const { type, active } = query;
        const where = {};
        if (type)
            where.type = type;
        if (active !== undefined)
            where.active = active === 'true';
        return this.prisma.chartOfAccount.findMany({ where, orderBy: { code: 'asc' }, include: { children: true } });
    }
    async createCoa(dto) { return this.prisma.chartOfAccount.create({ data: dto }); }
    async updateCoa(id, dto) { return this.prisma.chartOfAccount.update({ where: { id }, data: dto }); }
    async getBankAccounts() {
        return this.prisma.bankAccount.findMany({ where: { active: true }, orderBy: { bankName: 'asc' } });
    }
    async getBankTransactions(query) {
        const { bankAccountId, type, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (bankAccountId)
            where.bankAccountId = bankAccountId;
        if (type)
            where.type = type;
        const [data, total] = await Promise.all([
            this.prisma.bankTransaction.findMany({
                where, skip, take: Number(limit),
                include: { bankAccount: true, coa: true },
                orderBy: { tanggal: 'desc' },
            }),
            this.prisma.bankTransaction.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async createBankTransaction(dto) {
        const data = {
            ...dto,
            tanggal: dto.tanggal ? new Date(dto.tanggal) : new Date(),
            amount: Number(dto.amount || 0),
        };
        const transaction = await this.prisma.bankTransaction.create({ data });
        if (transaction.bankAccountId) {
            const delta = data.type === 'in' ? data.amount : -data.amount;
            await this.prisma.bankAccount.update({
                where: { id: transaction.bankAccountId },
                data: { balance: { increment: delta } },
            });
        }
        return transaction;
    }
    async createBankReceive(dto) {
        const transaction = await this.createBankTransaction({ ...dto, type: 'in' });
        await this.autoJournal.onPaymentReceived(dto.referenceId ?? transaction.id, Number(transaction.amount), new Date(transaction.tanggal), dto.referenceId ?? transaction.id, true);
        return { data: transaction, message: 'Penerimaan bank berhasil dicatat' };
    }
    async createBankPayment(dto) {
        const transaction = await this.createBankTransaction({ ...dto, type: 'out' });
        await this.autoJournal.onPaymentMade(dto.referenceId ?? transaction.id, Number(transaction.amount), new Date(transaction.tanggal), dto.referenceId ?? transaction.id, true);
        return { data: transaction, message: 'Pembayaran bank berhasil dicatat' };
    }
    async transferBankFunds(dto) {
        const date = dto.tanggal ? new Date(dto.tanggal) : new Date();
        const amount = Number(dto.amount || 0);
        const [debit, credit] = await this.prisma.$transaction([
            this.prisma.bankTransaction.create({
                data: {
                    bankAccountId: dto.fromBankAccountId,
                    tanggal: date,
                    type: 'out',
                    amount,
                    keterangan: dto.description ?? `Transfer ke ${dto.toBankAccountId}`,
                    referenceId: dto.referenceId,
                },
            }),
            this.prisma.bankTransaction.create({
                data: {
                    bankAccountId: dto.toBankAccountId,
                    tanggal: date,
                    type: 'in',
                    amount,
                    keterangan: dto.description ?? `Transfer dari ${dto.fromBankAccountId}`,
                    referenceId: dto.referenceId,
                },
            }),
        ]);
        await Promise.all([
            this.prisma.bankAccount.update({ where: { id: dto.fromBankAccountId }, data: { balance: { increment: -amount } } }),
            this.prisma.bankAccount.update({ where: { id: dto.toBankAccountId }, data: { balance: { increment: amount } } }),
        ]);
        return { data: { debit, credit }, message: 'Transfer antar rekening bank berhasil' };
    }
    async getCashTransactions(query) {
        const { type, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (type)
            where.type = type;
        const [data, total] = await Promise.all([
            this.prisma.cashTransaction.findMany({
                where, skip, take: Number(limit),
                include: { coa: true },
                orderBy: { tanggal: 'desc' },
            }),
            this.prisma.cashTransaction.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async createCashTransaction(dto) {
        const data = {
            ...dto,
            tanggal: dto.tanggal ? new Date(dto.tanggal) : new Date(),
            amount: Number(dto.amount || 0),
        };
        return this.prisma.cashTransaction.create({ data });
    }
    async createCashReceive(dto) {
        const transaction = await this.createCashTransaction({ ...dto, type: 'in' });
        await this.autoJournal.onPaymentReceived(dto.referenceId ?? transaction.id, Number(transaction.amount), new Date(transaction.tanggal), dto.referenceId ?? transaction.id, false);
        return { data: transaction, message: 'Penerimaan kas berhasil dicatat' };
    }
    async createCashPayment(dto) {
        const transaction = await this.createCashTransaction({ ...dto, type: 'out' });
        await this.autoJournal.onPaymentMade(dto.referenceId ?? transaction.id, Number(transaction.amount), new Date(transaction.tanggal), dto.referenceId ?? transaction.id, false);
        return { data: transaction, message: 'Pengeluaran kas berhasil dicatat' };
    }
    async getCashFlow(query) {
        const { dateFrom, dateTo } = query;
        const where = {};
        if (dateFrom && dateTo) {
            where.createdAt = { gte: new Date(dateFrom), lte: new Date(dateTo) };
        }
        const [masuk, keluar] = await Promise.all([
            this.prisma.cashTransaction.aggregate({ where: { ...where, type: 'in' }, _sum: { amount: true } }),
            this.prisma.cashTransaction.aggregate({ where: { ...where, type: 'out' }, _sum: { amount: true } }),
        ]);
        return {
            totalMasuk: masuk._sum.amount ?? 0,
            totalKeluar: keluar._sum.amount ?? 0,
            saldo: Number(masuk._sum.amount ?? 0) - Number(keluar._sum.amount ?? 0),
        };
    }
    async getStats() {
        const [totalJurnals, bankAccounts, cashIn, cashOut] = await Promise.all([
            this.prisma.journalEntry.count(),
            this.prisma.bankAccount.aggregate({ _sum: { balance: true }, where: { active: true } }),
            this.prisma.cashTransaction.aggregate({ _sum: { amount: true }, where: { type: 'in' } }),
            this.prisma.cashTransaction.aggregate({ _sum: { amount: true }, where: { type: 'out' } }),
        ]);
        return {
            totalJurnals,
            totalBankBalance: bankAccounts._sum.balance ?? 0,
            cashIn: cashIn._sum.amount ?? 0,
            cashOut: cashOut._sum.amount ?? 0,
        };
    }
    async createBankAccount(dto) {
        const data = await this.prisma.bankAccount.create({ data: dto });
        return { data, message: 'Rekening bank berhasil dibuat' };
    }
    async updateBankAccount(id, dto) {
        const data = await this.prisma.bankAccount.update({ where: { id }, data: dto });
        return { data, message: 'Rekening bank berhasil diupdate' };
    }
    async deleteBankAccount(id) {
        await this.prisma.bankAccount.update({ where: { id }, data: { active: false } });
        return { data: null, message: 'Rekening bank berhasil dinonaktifkan' };
    }
    async sendMoney(dto) {
        if (dto.bankAccountId) {
            const transaction = await this.createBankPayment(dto);
            return { data: transaction, message: 'Kirim dana berhasil dicatat' };
        }
        const transaction = await this.createCashPayment(dto);
        return { data: transaction, message: 'Kirim dana kas berhasil dicatat' };
    }
    async receiveMoney(dto) {
        if (dto.bankAccountId) {
            const transaction = await this.createBankReceive(dto);
            return { data: transaction, message: 'Penerimaan dana berhasil dicatat' };
        }
        const transaction = await this.createCashReceive(dto);
        return { data: transaction, message: 'Penerimaan dana kas berhasil dicatat' };
    }
    async getMoneyTransactions(query) {
        const [bank, cash] = await Promise.all([
            this.getBankTransactions(query),
            this.getCashTransactions(query),
        ]);
        const bankData = bank?.data ?? bank;
        const cashData = cash?.data ?? cash;
        return {
            data: [...(Array.isArray(bankData) ? bankData : []), ...(Array.isArray(cashData) ? cashData : [])],
            message: 'success',
            meta: {
                bank: typeof bank === 'object' && bank && 'meta' in bank ? bank.meta : null,
                cash: typeof cash === 'object' && cash && 'meta' in cash ? cash.meta : null,
            },
        };
    }
    async getBankReconciliations(query) {
        const { bankAccountId, status, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (bankAccountId)
            where.bankAccountId = bankAccountId;
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.bankReconciliation.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
            this.prisma.bankReconciliation.count({ where }),
        ]);
        return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
    }
    async getBankReconciliation(id) {
        const data = await this.prisma.bankReconciliation.findUnique({ where: { id } });
        if (!data)
            throw new NotFoundException('Rekonsiliasi tidak ditemukan');
        const transactions = await this.prisma.bankTransaction.findMany({ where: { referenceId: `recon:${id}` }, orderBy: { tanggal: 'desc' } });
        return { data: { ...data, transactions }, message: 'success' };
    }
    async getBankReconciliationsByAccount(accountId) {
        const data = await this.prisma.bankReconciliation.findMany({ where: { bankAccountId: accountId }, orderBy: { createdAt: 'desc' } });
        return { data, message: 'success' };
    }
    async createBankReconciliation(dto) {
        const data = await this.prisma.bankReconciliation.create({ data: dto });
        return { data, message: 'Rekonsiliasi berhasil dibuat' };
    }
    async updateBankReconciliation(id, dto) {
        const data = await this.prisma.bankReconciliation.update({ where: { id }, data: dto });
        return { data, message: 'Rekonsiliasi berhasil diupdate' };
    }
    parseAmount(v) {
        if (v === undefined || v === null || v === '')
            return 0;
        const s = String(v).replace(/[^0-9,.-]/g, '').replace(',', '.');
        const n = Number(s);
        return isNaN(n) ? 0 : n;
    }
    tryParseDate(v) {
        if (!v)
            return null;
        // try YYYY-MM-DD or ISO
        let d = new Date(v);
        if (!isNaN(d.getTime()))
            return d;
        // try DD/MM/YYYY or DD-MM-YYYY
        const m = v.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (m)
            return new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
        return null;
    }
    async importBankCsv(dto) {
        const { bankAccountId, csv, periodeAwal, periodeAkhir, saldoBuku = 0, saldoBank = 0, notes } = dto;
        if (!bankAccountId)
            throw new NotFoundException('bankAccountId required');
        if (!csv)
            throw new NotFoundException('csv content required');
        const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
        if (lines.length === 0)
            return { data: [], message: 'No rows' };
        const header = lines[0].split(/,|;|\t/).map((h) => h.trim().toLowerCase());
        const rows = lines.slice(1).map((ln) => ln.split(/,|;|\t/).map((c) => c.trim()));
        const isBCA = header.includes('cabang') || (header.includes('saldo') && header.includes('amount'));
        const isMandiri = header.includes('type') || header.includes('kredit') || (header.includes('debit') && header.includes('amount'));
        const isBNI = header.includes('debit') && header.includes('kredit');
        const parsed = [];
        for (const r of rows) {
            const obj = {};
            for (let i = 0; i < r.length; i++) {
                const key = header[i] ?? `col${i}`;
                obj[key] = r[i];
            }
            let tanggal = this.tryParseDate(obj['tanggal'] || obj['date'] || obj['tgl']);
            if (!tanggal)
                tanggal = new Date();
            let debit = 0;
            let kredit = 0;
            let amount = 0;
            if (isBCA) {
                amount = this.parseAmount(obj['amount'] || obj['jumlah'] || obj['nominal']);
                const desc = String(obj['keterangan'] || obj['description'] || '');
                if (/debit|dr|tarik|payment|keluar/i.test(desc))
                    debit = amount;
                else if (/credit|cr|setor|deposit|in/i.test(desc))
                    kredit = amount;
                else
                    kredit = amount;
            }
            else if (isMandiri) {
                const type = (obj['type'] || obj['tipe'] || obj['keterangan'] || '').toString().toUpperCase();
                amount = this.parseAmount(obj['amount'] || obj['jumlah'] || obj['nominal'] || obj['credit'] || obj['debit']);
                if (type === 'D' || /DEBIT|DB|KELUAR/i.test(type))
                    debit = amount;
                else if (type === 'C' || /CREDIT|CR|SETOR|MASUK/i.test(type))
                    kredit = amount;
                else {
                    debit = this.parseAmount(obj['debit']);
                    kredit = this.parseAmount(obj['credit']);
                    if (!debit && !kredit)
                        kredit = amount;
                }
            }
            else if (isBNI) {
                debit = this.parseAmount(obj['debit']);
                kredit = this.parseAmount(obj['kredit']);
                amount = kredit || debit;
            }
            else {
                debit = this.parseAmount(obj['debit'] || obj['dr']);
                kredit = this.parseAmount(obj['credit'] || obj['cr']);
                amount = kredit || debit || this.parseAmount(obj['amount'] || obj['nominal'] || obj['saldo-change']);
            }
            const type = debit > 0 ? 'out' : 'in';
            const finalAmount = Math.max(debit, kredit, amount);
            parsed.push({
                bankAccountId,
                tanggal,
                keterangan: obj['keterangan'] || obj['description'] || obj['keterangan transaksi'] || '',
                type,
                amount: finalAmount,
                raw: obj,
            });
        }
        const recon = await this.prisma.bankReconciliation.create({
            data: {
                bankAccountId,
                periodeAwal: periodeAwal ? new Date(periodeAwal) : new Date(parsed[0]?.tanggal || new Date()),
                periodeAkhir: periodeAkhir ? new Date(periodeAkhir) : new Date(parsed[parsed.length - 1]?.tanggal || new Date()),
                saldoBuku: saldoBuku,
                saldoBank: saldoBank,
                selisih: Number(saldoBank) - Number(saldoBuku),
                status: 'draft',
                notes,
            },
        });
        const created = [];
        for (const p of parsed) {
            const tx = await this.prisma.bankTransaction.create({ data: {
                    bankAccountId: p.bankAccountId,
                    tanggal: p.tanggal,
                    type: p.type === 'in' ? 'in' : 'out',
                    amount: p.amount,
                    keterangan: p.keterangan,
                    referenceId: `recon:${recon.id}`,
                } });
            created.push(tx);
        }
        const lastRow = parsed[parsed.length - 1];
        const lastSaldo = lastRow?.raw && (lastRow.raw['saldo'] || lastRow.raw['balance']);
        if (lastSaldo) {
            const parsedSaldo = this.parseAmount(lastSaldo);
            if (!isNaN(parsedSaldo) && parsedSaldo !== 0) {
                await this.prisma.bankAccount.update({ where: { id: bankAccountId }, data: { balance: parsedSaldo } });
            }
        }
        return { data: created, recon, message: 'Import CSV berhasil' };
    }
    async matchBankTransaction(reconId, dto) {
        const { transactionId, coaId } = dto;
        if (!transactionId)
            throw new NotFoundException('transactionId required');
        const tx = await this.prisma.bankTransaction.findUnique({ where: { id: transactionId } });
        if (!tx)
            throw new NotFoundException('Bank transaction tidak ditemukan');
        const updates = {};
        if (coaId)
            updates.coaId = coaId;
        updates.referenceId = `recon:${reconId}`;
        const updated = await this.prisma.bankTransaction.update({ where: { id: transactionId }, data: updates });
        return { data: updated, message: 'Transaksi direlasikan ke COA/reconciliation' };
    }
    async autoMatchBankReconciliation(reconId) {
        const recon = await this.prisma.bankReconciliation.findUnique({ where: { id: reconId } });
        if (!recon)
            throw new NotFoundException('Rekonsiliasi tidak ditemukan');
        const txs = await this.prisma.bankTransaction.findMany({ where: { referenceId: { contains: `recon:${reconId}` } } });
        const matched = [];
        for (const tx of txs) {
            if (tx.coaId)
                continue;
            const amount = Number(tx.amount);
            const start = new Date(recon.periodeAwal);
            const end = new Date(recon.periodeAkhir);
            // find journal lines with same amount within period +/-3 days
            const from = new Date(start);
            from.setDate(from.getDate() - 3);
            const to = new Date(end);
            to.setDate(to.getDate() + 3);
            const candidates = await this.prisma.journalEntryLine.findMany({
                where: {
                    AND: [
                        { journalEntry: { tanggal: { gte: from, lte: to } } },
                        { OR: [{ debit: amount }, { kredit: amount }] },
                    ],
                },
                include: { journalEntry: true },
            });
            if (candidates.length > 0) {
                const pick = candidates[0];
                await this.prisma.bankTransaction.update({ where: { id: tx.id }, data: { coaId: pick.coaId, referenceId: pick.journalEntryId } });
                matched.push({ txId: tx.id, journalEntryId: pick.journalEntryId, coaId: pick.coaId });
            }
        }
        return { data: matched, message: 'Auto-match selesai' };
    }
    async completeBankReconciliation(id) {
        const recon = await this.prisma.bankReconciliation.findUnique({ where: { id } });
        if (!recon)
            throw new NotFoundException('Rekonsiliasi tidak ditemukan');
        const txs = await this.prisma.bankTransaction.findMany({ where: { referenceId: { contains: `recon:${id}` } } });
        const saldoBank = txs.reduce((s, t) => s + Number(t.amount) * (t.type === 'in' ? 1 : -1), 0);
        const selisih = Number(saldoBank) - Number(recon.saldoBuku ?? 0);
        const updated = await this.prisma.bankReconciliation.update({ where: { id }, data: { saldoBank: saldoBank, selisih: selisih, status: 'completed' } });
        return { data: updated, message: 'Rekonsiliasi diselesaikan' };
    }
    async deleteCoa(id) {
        await this.prisma.chartOfAccount.delete({ where: { id } });
        return { data: null, message: 'COA berhasil dihapus' };
    }
};
FinanceService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __param(1, Inject(AutoJournalService)),
    __metadata("design:paramtypes", [PrismaService,
        AutoJournalService])
], FinanceService);
export { FinanceService };
