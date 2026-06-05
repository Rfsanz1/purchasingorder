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
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll() {
        const settings = await this.prisma.appSetting.findMany({ orderBy: { key: 'asc' } });
        return Object.fromEntries(settings.map(s => [s.key, s.value]));
    }
    async update(data) {
        const ops = Object.entries(data).map(([key, value]) => this.prisma.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } }));
        await Promise.all(ops);
        return this.getAll();
    }
    async get(key) {
        const s = await this.prisma.appSetting.findUnique({ where: { key } });
        return s?.value ?? null;
    }
    async getDocumentNumbers() {
        const configs = await this.prisma.documentNumberConfig.findMany({ orderBy: { docType: 'asc' } });
        return { data: configs, message: 'success' };
    }
    async updateDocumentNumber(docType, dto) {
        const data = await this.prisma.documentNumberConfig.upsert({
            where: { docType },
            update: dto,
            create: { docType, prefix: dto.prefix ?? '', separator: dto.separator ?? '/', useYear: dto.useYear ?? true, useMonth: dto.useMonth ?? true, padLength: dto.padLength ?? 4, lastSeq: dto.lastSeq ?? 0 },
        });
        return { data, message: 'Konfigurasi nomor dokumen berhasil diupdate' };
    }
    async getSmtp() {
        const smtp = await this.prisma.smtpSetting.findFirst();
        if (!smtp)
            return { data: null, message: 'SMTP belum dikonfigurasi' };
        const { password, ...safe } = smtp;
        return { data: { ...safe, passwordSet: !!password }, message: 'success' };
    }
    async updateSmtp(dto) {
        const existing = await this.prisma.smtpSetting.findFirst();
        const data = existing
            ? await this.prisma.smtpSetting.update({ where: { id: existing.id }, data: dto })
            : await this.prisma.smtpSetting.create({ data: dto });
        const { password, ...safe } = data;
        return { data: { ...safe, passwordSet: !!password }, message: 'Pengaturan SMTP berhasil disimpan' };
    }
    async testSmtp(to) {
        return { data: null, message: `Email test akan dikirim ke ${to} (fitur segera hadir)` };
    }
    async getFiscalYear() {
        const start = await this.get('fiscal_year_start_month');
        const year = await this.get('fiscal_year_start_year');
        return {
            data: {
                startMonth: start ? Number(start) : 1,
                startYear: year ? Number(year) : new Date().getFullYear(),
            },
            message: 'success',
        };
    }
    async updateFiscalYear(dto) {
        await this.update({
            fiscal_year_start_month: String(dto.startMonth),
            fiscal_year_start_year: String(dto.startYear),
        });
        return { data: dto, message: 'Tahun fiskal berhasil diupdate' };
    }
};
SettingsService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], SettingsService);
export { SettingsService };
