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
let JournalService = class JournalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    genNomor() {
        const d = new Date();
        return `JRN/${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}/${String(Date.now()).slice(-6)}`;
    }
    async findAll(query) {
        const { status, dateFrom, dateTo, search, referensi, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status)
            where.status = status;
        if (referensi)
            where.referensi = referensi;
        if (search)
            where.OR = [
                { nomor: { contains: search, mode: 'insensitive' } },
                { deskripsi: { contains: search, mode: 'insensitive' } },
            ];
        if (dateFrom || dateTo) {
            where.tanggal = {};
            if (dateFrom)
                where.tanggal.gte = new Date(dateFrom);
            if (dateTo)
                where.tanggal.lte = new Date(dateTo);
        }
        const [data, total] = await Promise.all([
            this.prisma.journal.findMany({
                where, skip, take: Number(limit),
                orderBy: { tanggal: 'desc' },
                include: { lines: { include: { account: { select: { id: true, code: true, name: true } } } } },
            }),
            this.prisma.journal.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async findOne(id) {
        const j = await this.prisma.journal.findUnique({
            where: { id },
            include: { lines: { include: { account: true } } },
        });
        if (!j)
            throw new NotFoundException(`Jurnal ${id} tidak ditemukan`);
        return j;
    }
    async createJournal(dto) {
        const { lines, tanggal, deskripsi, referensi, createdById } = dto;
        if (!lines || lines.length < 2)
            throw new BadRequestException('Jurnal minimal memiliki 2 baris');
        const totalDebit = lines.reduce((s, l) => s + Number(l.debit || 0), 0);
        const totalKredit = lines.reduce((s, l) => s + Number(l.kredit || 0), 0);
        if (Math.abs(totalDebit - totalKredit) > 0.01)
            throw new BadRequestException(`Total debit (${totalDebit.toLocaleString('id-ID')}) harus sama dengan total kredit (${totalKredit.toLocaleString('id-ID')})`);
        if (totalDebit === 0)
            throw new BadRequestException('Total debit/kredit tidak boleh nol');
        for (const line of lines) {
            const acc = await this.prisma.account.findUnique({ where: { id: line.accountId } });
            if (!acc)
                throw new BadRequestException(`Akun ID ${line.accountId} tidak ditemukan`);
            if (!acc.isActive)
                throw new BadRequestException(`Akun ${acc.code} tidak aktif`);
        }
        return this.prisma.journal.create({
            data: {
                nomor: this.genNomor(),
                tanggal: new Date(tanggal),
                deskripsi,
                referensi,
                createdById,
                status: 'DRAFT',
                lines: {
                    create: lines.map((l) => ({
                        accountId: l.accountId,
                        debit: l.debit || 0,
                        kredit: l.kredit || 0,
                        deskripsi: l.deskripsi,
                    })),
                },
            },
            include: { lines: { include: { account: true } } },
        });
    }
    async postJournal(id) {
        const j = await this.findOne(id);
        if (j.status !== 'DRAFT')
            throw new BadRequestException(`Hanya jurnal DRAFT yang bisa di-post, status saat ini: ${j.status}`);
        return this.prisma.journal.update({
            where: { id },
            data: { status: 'POSTED' },
            include: { lines: { include: { account: true } } },
        });
    }
    async cancelJournal(id) {
        const j = await this.findOne(id);
        if (j.status !== 'DRAFT')
            throw new BadRequestException('Hanya jurnal DRAFT yang bisa dibatalkan');
        return this.prisma.journal.update({ where: { id }, data: { status: 'CANCELLED' } });
    }
    async reverseJournal(id) {
        const original = await this.findOne(id);
        if (original.status !== 'POSTED')
            throw new BadRequestException('Hanya jurnal POSTED yang bisa dibalik');
        return this.prisma.journal.create({
            data: {
                nomor: this.genNomor(),
                tanggal: new Date(),
                deskripsi: `PEMBALIK: ${original.deskripsi || original.nomor}`,
                referensi: original.nomor,
                status: 'POSTED',
                reversalOf: original.id,
                lines: {
                    create: original.lines.map((l) => ({
                        accountId: l.accountId,
                        debit: l.kredit,
                        kredit: l.debit,
                        deskripsi: `Pembalik: ${l.deskripsi || ''}`,
                    })),
                },
            },
            include: { lines: { include: { account: true } } },
        });
    }
};
JournalService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], JournalService);
export { JournalService };
