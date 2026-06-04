import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class InvoiceService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private async generateNumber() {
    const count = await this.prisma.invoice.count();
    const year = new Date().getFullYear();
    return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async findAll(query: any) {
    const { search, status, customerId, dateFrom, dateTo, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (search) where.OR = [
      { noInvoice: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
    ];
    if (dateFrom || dateTo) {
      where.tanggal = {};
      if (dateFrom) where.tanggal.gte = new Date(dateFrom);
      if (dateTo) where.tanggal.lte = new Date(dateTo);
    }
    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where, skip, take: Number(limit),
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          items: true,
          payments: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where }),
    ]);
    return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async findOne(id: string) {
    const data = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        payments: { orderBy: { createdAt: 'desc' } },
        creditNotes: true,
      },
    });
    if (!data) throw new NotFoundException('Invoice tidak ditemukan');
    return { data, message: 'success' };
  }

  async create(dto: any) {
    if (!dto.customerId) throw new BadRequestException('customerId harus diisi');
    const noInvoice = dto.noInvoice ?? dto.nomorInvoice ?? await this.generateNumber();
    const { items, nomorInvoice, ...rest } = dto;
    const data = await this.prisma.invoice.create({
      data: {
        ...rest,
        noInvoice,
        status: rest.status ?? 'draft',
        items: items?.length ? { create: items } : undefined,
      },
      include: { items: true, customer: { select: { id: true, name: true } } },
    });
    return { data, message: 'Invoice berhasil dibuat' };
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    const { items, ...rest } = dto;
    const data = await this.prisma.invoice.update({
      where: { id },
      data: rest,
      include: { items: true },
    });
    return { data, message: 'Invoice berhasil diupdate' };
  }

  async delete(id: string) {
    const inv = await this.prisma.invoice.findUnique({ where: { id } });
    if (!inv) throw new NotFoundException('Invoice tidak ditemukan');
    if (inv.status !== 'draft') throw new BadRequestException('Hanya invoice draft yang dapat dihapus');
    await this.prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    await this.prisma.invoice.delete({ where: { id } });
    return { data: null, message: 'Invoice berhasil dihapus' };
  }

  async send(id: string) {
    await this.findOne(id);
    const data = await this.prisma.invoice.update({ where: { id }, data: { status: 'sent', sentAt: new Date() } });
    return { data, message: 'Invoice berhasil dikirim' };
  }

  async addPayment(invoiceId: string, dto: any) {
    if (!dto.amount || dto.amount <= 0) throw new BadRequestException('Jumlah pembayaran harus diisi');
    const inv = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });
    if (!inv) throw new NotFoundException('Invoice tidak ditemukan');
    const payment = await this.prisma.invoicePayment.create({
      data: {
        invoiceId,
        amount: dto.amount,
        method: dto.method ?? 'transfer',
        reference: dto.reference,
        note: dto.note,
      },
    });
    const totalPaid = await this.prisma.invoicePayment.aggregate({ where: { invoiceId }, _sum: { amount: true } });
    const paid = Number(totalPaid._sum.amount ?? 0);
    const invoiceTotal = Number(inv.grandTotal ?? 0);
    const newStatus = paid >= invoiceTotal ? 'paid' : paid > 0 ? 'partial' : 'sent';
    await this.prisma.invoice.update({ where: { id: invoiceId }, data: { status: newStatus, paidAmount: paid } });
    return { data: payment, message: 'Pembayaran berhasil dicatat' };
  }

  async getPayments(invoiceId: string) {
    const data = await this.prisma.invoicePayment.findMany({
      where: { invoiceId },
      orderBy: { tanggal: 'desc' },
    });
    return { data, message: 'success' };
  }

  async issueCreditNote(invoiceId: string, dto: any) {
    if (!dto.amount || dto.amount <= 0) throw new BadRequestException('Jumlah credit note harus diisi');
    await this.findOne(invoiceId);
    const counter = await this.prisma.creditNote.count();
    const nomor = dto.nomor ?? `CN-${new Date().getFullYear()}-${String(counter + 1).padStart(4, '0')}`;
    const data = await this.prisma.creditNote.create({
      data: {
        invoiceId,
        nomor,
        amount: dto.amount,
        reason: dto.reason ?? '',
        status: 'issued',
      },
    });
    return { data, message: 'Credit note berhasil diterbitkan' };
  }

  async getCreditNotes(invoiceId: string) {
    const data = await this.prisma.creditNote.findMany({ where: { invoiceId }, orderBy: { createdAt: 'desc' } });
    return { data, message: 'success' };
  }

  async getStats() {
    const [total, draft, sent, paid, overdue, totalRevenue] = await Promise.all([
      this.prisma.invoice.count(),
      this.prisma.invoice.count({ where: { status: 'draft' } }),
      this.prisma.invoice.count({ where: { status: 'sent' } }),
      this.prisma.invoice.count({ where: { status: 'paid' } }),
      this.prisma.invoice.count({ where: { status: 'sent', dueDate: { lt: new Date() } } }),
      this.prisma.invoice.aggregate({ _sum: { grandTotal: true }, where: { status: 'paid' } }),
    ]);
    return { data: { total, draft, sent, paid, overdue, totalRevenue: totalRevenue._sum.grandTotal ?? 0 }, message: 'success' };
  }
}
