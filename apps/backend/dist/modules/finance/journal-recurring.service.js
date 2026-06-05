var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JournalRecurringService_1;
import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let JournalRecurringService = JournalRecurringService_1 = class JournalRecurringService {
    prisma;
    logger = new Logger(JournalRecurringService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    genNomor() {
        const d = new Date();
        return `RJR/${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}/${String(Date.now()).slice(-6)}`;
    }
    normalizeFrequency(frequency) {
        const value = String(frequency ?? 'MONTHLY').toUpperCase();
        if (!['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'].includes(value)) {
            throw new BadRequestException('Frequency harus salah satu dari DAILY, WEEKLY, MONTHLY, YEARLY');
        }
        return value;
    }
    nextRunDate(current, frequency, interval = 1) {
        const next = new Date(current);
        switch (frequency) {
            case 'DAILY':
                next.setDate(next.getDate() + interval);
                break;
            case 'WEEKLY':
                next.setDate(next.getDate() + interval * 7);
                break;
            case 'MONTHLY':
                next.setMonth(next.getMonth() + interval);
                break;
            case 'YEARLY':
                next.setFullYear(next.getFullYear() + interval);
                break;
        }
        return next;
    }
    async validateLines(lines) {
        if (!lines || lines.length < 2) {
            throw new BadRequestException('Recurring journal minimal memiliki 2 baris');
        }
        const totalDebit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
        const totalKredit = lines.reduce((sum, line) => sum + Number(line.kredit || 0), 0);
        if (Math.abs(totalDebit - totalKredit) > 0.01) {
            throw new BadRequestException('Total debit dan kredit harus seimbang');
        }
        for (const line of lines) {
            const account = await this.prisma.account.findUnique({ where: { id: line.accountId } });
            if (!account)
                throw new BadRequestException(`Akun ID ${line.accountId} tidak ditemukan`);
            if (!account.isActive)
                throw new BadRequestException(`Akun ${account.code} tidak aktif`);
        }
    }
    async findAll(query) {
        const { status, search, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status)
            where.status = status;
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        const [data, total] = await Promise.all([
            this.prisma.journalRecurring.findMany({ where, skip, take: Number(limit), include: { lines: true }, orderBy: { nextRunAt: 'asc' } }),
            this.prisma.journalRecurring.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async findOne(id) {
        const recurring = await this.prisma.journalRecurring.findUnique({ where: { id }, include: { lines: true } });
        if (!recurring)
            throw new NotFoundException(`Recurring journal ${id} tidak ditemukan`);
        return recurring;
    }
    async create(dto) {
        const frequency = this.normalizeFrequency(dto.frequency);
        const interval = Number(dto.interval || 1);
        const nextRunAt = dto.nextRunAt ? new Date(dto.nextRunAt) : new Date();
        await this.validateLines(dto.lines);
        return this.prisma.journalRecurring.create({
            data: {
                name: dto.name,
                description: dto.description,
                frequency,
                interval,
                startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
                nextRunAt,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                status: dto.status ?? 'ACTIVE',
                createdById: dto.createdById,
                lines: { create: dto.lines.map((line) => ({
                        accountId: line.accountId,
                        debit: line.debit || 0,
                        kredit: line.kredit || 0,
                        deskripsi: line.deskripsi,
                    })) },
            },
            include: { lines: true },
        });
    }
    async update(id, dto) {
        const recurring = await this.findOne(id);
        const frequency = dto.frequency ? this.normalizeFrequency(dto.frequency) : recurring.frequency;
        const interval = dto.interval !== undefined ? Number(dto.interval) : recurring.interval;
        if (dto.lines) {
            await this.validateLines(dto.lines);
        }
        const updateData = {
            ...dto,
            frequency,
            interval,
            startDate: dto.startDate ? new Date(dto.startDate) : recurring.startDate,
            nextRunAt: dto.nextRunAt ? new Date(dto.nextRunAt) : recurring.nextRunAt,
            endDate: dto.endDate ? new Date(dto.endDate) : recurring.endDate,
        };
        if (dto.lines) {
            await this.prisma.journalRecurringLine.deleteMany({ where: { journalRecurringId: id } });
            updateData.lines = { create: dto.lines.map((line) => ({
                    accountId: line.accountId,
                    debit: line.debit || 0,
                    kredit: line.kredit || 0,
                    deskripsi: line.deskripsi,
                })) };
        }
        return this.prisma.journalRecurring.update({ where: { id }, data: updateData, include: { lines: true } });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.journalRecurring.delete({ where: { id } });
        return { message: 'Recurring journal berhasil dihapus' };
    }
    async runDueRecurring(id) {
        const now = new Date();
        const where = { status: 'ACTIVE', nextRunAt: { lte: now } };
        if (id)
            where.id = id;
        const items = await this.prisma.journalRecurring.findMany({ where, include: { lines: true } });
        if (!items.length)
            return { message: 'Tidak ada recurring journal yang perlu dijalankan' };
        const results = [];
        for (const recurring of items) {
            try {
                const journal = await this.prisma.journal.create({
                    data: {
                        nomor: this.genNomor(),
                        tanggal: recurring.nextRunAt,
                        deskripsi: recurring.description || `Recurring journal ${recurring.name}`,
                        referensi: recurring.id,
                        status: 'POSTED',
                        lines: {
                            create: recurring.lines.map((line) => ({
                                accountId: line.accountId,
                                debit: line.debit,
                                kredit: line.kredit,
                                deskripsi: line.deskripsi,
                            })),
                        },
                    },
                });
                const nextRun = this.nextRunDate(recurring.nextRunAt, recurring.frequency, recurring.interval);
                const statusUpdate = recurring.endDate && nextRun > recurring.endDate ? 'INACTIVE' : recurring.status;
                await this.prisma.journalRecurring.update({
                    where: { id: recurring.id },
                    data: {
                        journalId: journal.id,
                        nextRunAt: statusUpdate === 'INACTIVE' ? recurring.nextRunAt : nextRun,
                        status: statusUpdate,
                    },
                });
                results.push({ recurringId: recurring.id, journalId: journal.id, status: 'posted' });
            }
            catch (err) {
                this.logger.error(`Gagal menjalankan recurring journal ${recurring.id}`, err);
                results.push({ recurringId: recurring.id, error: err.message });
            }
        }
        return { message: 'Recurring journal dijalankan', results };
    }
};
JournalRecurringService = JournalRecurringService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], JournalRecurringService);
export { JournalRecurringService };
