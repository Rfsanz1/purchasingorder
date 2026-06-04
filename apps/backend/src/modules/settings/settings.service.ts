import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getAll() {
    const settings = await this.prisma.appSetting.findMany({ orderBy: { key: 'asc' } });
    return Object.fromEntries(settings.map(s => [s.key, s.value]));
  }

  async update(data: Record<string, string>) {
    const ops = Object.entries(data).map(([key, value]) =>
      this.prisma.appSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    );
    await Promise.all(ops);
    return this.getAll();
  }

  async get(key: string) {
    const s = await this.prisma.appSetting.findUnique({ where: { key } });
    return s?.value ?? null;
  }

  async getDocumentNumbers() {
    const configs = await this.prisma.documentNumberConfig.findMany({ orderBy: { docType: 'asc' } });
    return { data: configs, message: 'success' };
  }

  async updateDocumentNumber(docType: string, dto: { prefix?: string; separator?: string; useYear?: boolean; useMonth?: boolean; padLength?: number; lastSeq?: number }) {
    const data = await this.prisma.documentNumberConfig.upsert({
      where: { docType },
      update: dto,
      create: { docType, prefix: dto.prefix ?? '', separator: dto.separator ?? '/', useYear: dto.useYear ?? true, useMonth: dto.useMonth ?? true, padLength: dto.padLength ?? 4, lastSeq: dto.lastSeq ?? 0 },
    });
    return { data, message: 'Konfigurasi nomor dokumen berhasil diupdate' };
  }

  async getSmtp() {
    const smtp = await this.prisma.smtpSetting.findFirst();
    if (!smtp) return { data: null, message: 'SMTP belum dikonfigurasi' };
    const { password, ...safe } = smtp as any;
    return { data: { ...safe, passwordSet: !!password }, message: 'success' };
  }

  async updateSmtp(dto: { host: string; port: number; username: string; password?: string; fromEmail: string; fromName?: string; secure?: boolean }) {
    const existing = await this.prisma.smtpSetting.findFirst();
    const data = existing
      ? await this.prisma.smtpSetting.update({ where: { id: existing.id }, data: dto })
      : await this.prisma.smtpSetting.create({ data: dto as any });
    const { password, ...safe } = data as any;
    return { data: { ...safe, passwordSet: !!password }, message: 'Pengaturan SMTP berhasil disimpan' };
  }

  async testSmtp(to: string) {
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

  async updateFiscalYear(dto: { startMonth: number; startYear: number }) {
    await this.update({
      fiscal_year_start_month: String(dto.startMonth),
      fiscal_year_start_year: String(dto.startYear),
    });
    return { data: dto, message: 'Tahun fiskal berhasil diupdate' };
  }
}
