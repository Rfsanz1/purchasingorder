import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AutoJournalService } from './auto-journal.service.js';

@Injectable()
export class FinanceService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AutoJournalService) private readonly autoJournal: AutoJournalService,
  ) {}

  async getJournalEntries(query: any) {
    const { search, status, type, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.noJurnal = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (type) where.type = type;
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

  async createJournalEntry(dto: any) {
    const { lines, ...data } = dto;
    const noJurnal = `JRN/${new Date().getFullYear()}/${String(Date.now()).slice(-5)}`;
    return this.prisma.journalEntry.create({
      data: { ...data, noJurnal, lines: { create: lines ?? [] } },
      include: { lines: true },
    });
  }

  async getCoa(query: any) {
    const { type, active } = query;
    const where: any = {};
    if (type) where.type = type;
    if (active !== undefined) where.active = active === 'true';
    return this.prisma.chartOfAccount.findMany({ where, orderBy: { code: 'asc' }, include: { children: true } });
  }

  async createCoa(dto: any) { return this.prisma.chartOfAccount.create({ data: dto }); }
  async updateCoa(id: string, dto: any) { return this.prisma.chartOfAccount.update({ where: { id }, data: dto }); }

  async getBankAccounts() {
    return this.prisma.bankAccount.findMany({ where: { active: true }, orderBy: { bankName: 'asc' } });
  }

  async getBankTransactions(query: any) {
    const { bankAccountId, type, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (bankAccountId) where.bankAccountId = bankAccountId;
    if (type) where.type = type;
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

  async createBankTransaction(dto: any) {
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

  async createBankReceive(dto: any) {
    const transaction = await this.createBankTransaction({ ...dto, type: 'in' });
    await this.autoJournal.onPaymentReceived(
      dto.referenceId ?? transaction.id,
      Number(transaction.amount),
      new Date(transaction.tanggal),
      dto.referenceId ?? transaction.id,
      true,
    );
    return { data: transaction, message: 'Penerimaan bank berhasil dicatat' };
  }

  async createBankPayment(dto: any) {
    const transaction = await this.createBankTransaction({ ...dto, type: 'out' });
    await this.autoJournal.onPaymentMade(
      dto.referenceId ?? transaction.id,
      Number(transaction.amount),
      new Date(transaction.tanggal),
      dto.referenceId ?? transaction.id,
      true,
    );
    return { data: transaction, message: 'Pembayaran bank berhasil dicatat' };
  }

  async transferBankFunds(dto: any) {
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

  async getCashTransactions(query: any) {
    const { type, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (type) where.type = type;
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

  async createCashTransaction(dto: any) {
    const data = {
      ...dto,
      tanggal: dto.tanggal ? new Date(dto.tanggal) : new Date(),
      amount: Number(dto.amount || 0),
    };
    return this.prisma.cashTransaction.create({ data });
  }

  async createCashReceive(dto: any) {
    const transaction = await this.createCashTransaction({ ...dto, type: 'in' });
    await this.autoJournal.onPaymentReceived(
      dto.referenceId ?? transaction.id,
      Number(transaction.amount),
      new Date(transaction.tanggal),
      dto.referenceId ?? transaction.id,
      false,
    );
    return { data: transaction, message: 'Penerimaan kas berhasil dicatat' };
  }

  async createCashPayment(dto: any) {
    const transaction = await this.createCashTransaction({ ...dto, type: 'out' });
    await this.autoJournal.onPaymentMade(
      dto.referenceId ?? transaction.id,
      Number(transaction.amount),
      new Date(transaction.tanggal),
      dto.referenceId ?? transaction.id,
      false,
    );
    return { data: transaction, message: 'Pengeluaran kas berhasil dicatat' };
  }

  async getCashFlow(query: any) {
    const { dateFrom, dateTo } = query;
    const where: any = {};
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

  async createBankAccount(dto: any) {
    const data = await this.prisma.bankAccount.create({ data: dto });
    return { data, message: 'Rekening bank berhasil dibuat' };
  }

  async updateBankAccount(id: string, dto: any) {
    const data = await this.prisma.bankAccount.update({ where: { id }, data: dto });
    return { data, message: 'Rekening bank berhasil diupdate' };
  }

  async deleteBankAccount(id: string) {
    await this.prisma.bankAccount.update({ where: { id }, data: { active: false } });
    return { data: null, message: 'Rekening bank berhasil dinonaktifkan' };
  }

  async getBankReconciliations(query: any) {
    const { bankAccountId, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (bankAccountId) where.bankAccountId = bankAccountId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.bankReconciliation.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      this.prisma.bankReconciliation.count({ where }),
    ]);
    return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async getBankReconciliation(id: string) {
    const data = await this.prisma.bankReconciliation.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Rekonsiliasi tidak ditemukan');
    return { data, message: 'success' };
  }

  async createBankReconciliation(dto: any) {
    const data = await this.prisma.bankReconciliation.create({ data: dto });
    return { data, message: 'Rekonsiliasi berhasil dibuat' };
  }

  async updateBankReconciliation(id: string, dto: any) {
    const data = await this.prisma.bankReconciliation.update({ where: { id }, data: dto });
    return { data, message: 'Rekonsiliasi berhasil diupdate' };
  }

  async deleteCoa(id: string) {
    await this.prisma.chartOfAccount.delete({ where: { id } });
    return { data: null, message: 'COA berhasil dihapus' };
  }
}
