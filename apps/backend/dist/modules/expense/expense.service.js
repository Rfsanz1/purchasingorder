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
import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let ExpenseService = class ExpenseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateNumber(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const count = await this.prisma.expense.count({
            where: {
                date: {
                    gte: new Date(Date.UTC(year, Number(month) - 1, 1)),
                    lt: new Date(Date.UTC(year, Number(month) - 1 + 1, 1)),
                },
            },
        });
        return `BIA/${year}/${month}/${String(count + 1).padStart(4, '0')}`;
    }
    buildFilter(query) {
        const { status, startDate, endDate, accountId, branchId } = query;
        const where = {};
        if (status)
            where.status = status;
        if (startDate || endDate)
            where.date = {};
        if (startDate)
            where.date.gte = new Date(startDate);
        if (endDate)
            where.date.lte = new Date(endDate);
        if (accountId)
            where.accountId = accountId;
        if (branchId)
            where.branchId = branchId;
        return where;
    }
    async findAll(query) {
        const { page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            this.prisma.expense.findMany({
                where: this.buildFilter(query),
                orderBy: { date: 'desc' },
                skip,
                take: Number(limit),
                include: { contact: true, account: true, paymentAccount: true, tax: true, branch: true },
            }),
            this.prisma.expense.count({ where: this.buildFilter(query) }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async findOne(id) {
        const expense = await this.prisma.expense.findUnique({
            where: { id },
            include: { contact: true, account: true, paymentAccount: true, tax: true, branch: true },
        });
        if (!expense)
            throw new NotFoundException(`Expense ${id} tidak ditemukan`);
        return expense;
    }
    async create(dto) {
        const date = new Date(dto.date);
        const number = dto.number || await this.generateNumber(date);
        const expense = await this.prisma.expense.create({
            data: {
                ...dto,
                date,
                number,
                status: 'draft',
                taxAmount: dto.taxAmount ?? 0,
                totalAmount: dto.totalAmount,
                tags: dto.tags || [],
            },
            include: { contact: true, account: true, paymentAccount: true, tax: true, branch: true },
        });
        return expense;
    }
    async update(id, dto) {
        const expense = await this.findOne(id);
        if (expense.status === 'paid')
            throw new BadRequestException('Tidak bisa mengubah expense yang sudah dibayar');
        return this.prisma.expense.update({
            where: { id },
            data: {
                ...dto,
                date: dto.date ? new Date(dto.date) : expense.date,
                taxAmount: dto.taxAmount ?? expense.taxAmount,
                totalAmount: dto.totalAmount ?? expense.totalAmount,
                tags: dto.tags ?? expense.tags,
            },
            include: { contact: true, account: true, paymentAccount: true, tax: true, branch: true },
        });
    }
    async remove(id) {
        const expense = await this.findOne(id);
        if (expense.status !== 'draft')
            throw new BadRequestException('Hanya expense draft yang bisa dihapus');
        await this.prisma.expense.delete({ where: { id } });
        return { success: true };
    }
    async submit(id) {
        const expense = await this.findOne(id);
        if (expense.status !== 'draft')
            throw new BadRequestException('Hanya expense draft yang bisa disubmit');
        return this.prisma.expense.update({ where: { id }, data: { status: 'submitted' } });
    }
    async approve(id) {
        const expense = await this.findOne(id);
        if (expense.status !== 'submitted')
            throw new BadRequestException('Hanya expense submitted yang bisa diapprove');
        return this.prisma.expense.update({ where: { id }, data: { status: 'approved', approvedAt: new Date(), approvedBy: expense.createdBy } });
    }
    async reject(id) {
        const expense = await this.findOne(id);
        if (expense.status !== 'submitted')
            throw new BadRequestException('Hanya expense submitted yang bisa ditolak');
        return this.prisma.expense.update({ where: { id }, data: { status: 'draft', approvedBy: null, approvedAt: null } });
    }
    async pay(id, paymentAccountId, paidBy) {
        const expense = await this.findOne(id);
        if (expense.status !== 'approved')
            throw new BadRequestException('Hanya expense approved yang bisa dibayar');
        if (!paymentAccountId)
            throw new BadRequestException('Payment account harus dipilih');
        const paymentAccount = await this.prisma.bankAccount.findUnique({ where: { id: paymentAccountId } });
        if (!paymentAccount)
            throw new NotFoundException('Rekening bayar tidak ditemukan');
        if (Number(paymentAccount.balance) < Number(expense.totalAmount)) {
            throw new BadRequestException('Saldo rekening tidak mencukupi');
        }
        const taxAccount = expense.taxId ? await this.prisma.tax.findUnique({ where: { id: expense.taxId } }) : null;
        await this.prisma.$transaction(async (tx) => {
            await tx.expense.update({
                where: { id },
                data: { status: 'paid', paymentAccountId, paidAt: new Date(), approvedAt: expense.approvedAt ?? new Date() },
            });
            await tx.bankAccount.update({
                where: { id: paymentAccountId },
                data: { balance: { decrement: expense.totalAmount } },
            });
            const journalLines = [
                { accountId: expense.accountId, debit: expense.amount, kredit: 0, deskripsi: `Biaya ${expense.number}` },
            ];
            if (expense.taxId && expense.taxAmount > 0 && taxAccount?.accountId) {
                journalLines.push({ accountId: taxAccount.accountId, debit: Number(expense.taxAmount), kredit: 0, deskripsi: `PPN ${expense.number}` });
            }
            journalLines.push({ accountId: paymentAccount.id, debit: 0, kredit: expense.totalAmount, deskripsi: `Bayar ${expense.number}` });
            await tx.journal.create({
                data: {
                    nomor: `EXP/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(Date.now()).slice(-6)}`,
                    tanggal: new Date(),
                    deskripsi: `Pembayaran expense ${expense.number}`,
                    referensi: expense.id,
                    status: 'POSTED',
                    lines: { create: journalLines.map((l) => ({ ...l })) },
                },
            });
        });
        return this.findOne(id);
    }
    async summary(query) {
        const where = this.buildFilter(query);
        const totalAmount = await this.prisma.expense.aggregate({ where, _sum: { totalAmount: true } });
        return { totalAmount: Number(totalAmount._sum.totalAmount ?? 0) };
    }
    async byAccount(query) {
        const where = this.buildFilter(query);
        const groups = await this.prisma.expense.groupBy({
            by: ['accountId'],
            where,
            _sum: { totalAmount: true, amount: true, taxAmount: true },
        });
        const accounts = await this.prisma.account.findMany({ where: { id: { in: groups.map((g) => g.accountId) } } });
        return groups.map((g) => ({
            accountId: g.accountId,
            account: accounts.find((a) => a.id === g.accountId) ?? null,
            totalAmount: Number(g._sum.totalAmount ?? 0),
            amount: Number(g._sum.amount ?? 0),
            taxAmount: Number(g._sum.taxAmount ?? 0),
        }));
    }
    async getExpenseJournals(expenseId) {
        return this.prisma.journal.findMany({
            where: { referensi: expenseId },
            include: { lines: { include: { account: true } } },
            orderBy: { tanggal: 'desc' },
        });
    }
    async import(fileBuffer) {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(fileBuffer);
        const sheet = workbook.worksheets[0];
        const imported = [];
        sheet.eachRow({ includeEmpty: false }, (row, index) => {
            if (index === 1)
                return;
            const values = Array.isArray(row.values) ? row.values.slice(1) : [];
            const [number, date, contactCode, accountCode, paymentAccountNo, amount, taxCode, taxAmount, totalAmount, description, tags, branchCode] = values;
            imported.push({ number, date, contactCode, accountCode, paymentAccountNo, amount, taxCode, taxAmount, totalAmount, description, tags, branchCode });
        });
        const results = [];
        for (const item of imported) {
            const contact = item.contactCode ? await this.prisma.contact.findFirst({ where: { code: item.contactCode } }) : null;
            const account = await this.prisma.account.findFirst({ where: { code: item.accountCode } });
            const paymentAccount = item.paymentAccountNo ? await this.prisma.bankAccount.findFirst({ where: { accountNo: item.paymentAccountNo } }) : null;
            const tax = item.taxCode ? await this.prisma.tax.findFirst({ where: { kode: item.taxCode } }) : null;
            const branch = item.branchCode ? await this.prisma.branch.findFirst({ where: { kode: item.branchCode } }) : null;
            if (!account)
                throw new BadRequestException(`Akun beban tidak ditemukan untuk kode ${item.accountCode}`);
            results.push(await this.prisma.expense.create({
                data: {
                    number: item.number || await this.generateNumber(new Date(item.date)),
                    date: new Date(item.date),
                    contactId: contact?.id,
                    accountId: account.id,
                    paymentAccountId: paymentAccount?.id,
                    amount: Number(item.amount || 0),
                    taxId: tax?.id,
                    taxAmount: Number(item.taxAmount || 0),
                    totalAmount: Number(item.totalAmount || 0),
                    description: item.description || '',
                    attachment: null,
                    status: 'draft',
                    tags: item.tags ? String(item.tags).split(',').map((v) => v.trim()) : [],
                    branchId: branch?.id,
                    createdBy: 'import-script',
                },
            }));
        }
        return results;
    }
};
ExpenseService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], ExpenseService);
export { ExpenseService };
