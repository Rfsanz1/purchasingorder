import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class SalesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getOrders(query: any) {
    const { search, status, salesName, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.namaCustomer = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (salesName) where.salesName = salesName;
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where, skip, take: Number(limit),
        include: { customer: true, orderItems: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getOrder(id: number) {
    const o = await this.prisma.order.findUnique({
      where: { id },
      include: { customer: true, orderItems: { include: { product: true } } },
    });
    if (!o) throw new NotFoundException('Order tidak ditemukan');
    return o;
  }

  async createOrder(dto: any) {
    const { items, ...orderData } = dto;
    return this.prisma.order.create({
      data: { ...orderData, items: items ?? [], orderItems: items?.length ? { create: items } : undefined },
    });
  }

  async updateOrder(id: number, dto: any) {
    return this.prisma.order.update({ where: { id }, data: dto });
  }

  async deleteOrder(id: number) {
    return this.prisma.order.update({ where: { id }, data: { status: 'cancelled' } });
  }

  async updatePengiriman(id: number, dto: { statusPengiriman: string; driverName?: string }) {
    return this.prisma.order.update({ where: { id }, data: dto });
  }

  async uploadBuktiTransfer(id: number, base64Data: string) {
    return this.prisma.order.update({
      where: { id },
      data: { buktiTransferData: base64Data },
    });
  }

  async getCustomerLocation(token: string) {
    const order = await this.prisma.order.findFirst({
      where: { customerLocToken: token },
      select: { customerLat: true, customerLng: true, namaCustomer: true },
    });
    if (!order) throw new NotFoundException('Token tidak valid');
    return order;
  }

  async saveCustomerLocation(token: string, lat: string, lng: string) {
    return this.prisma.order.updateMany({
      where: { customerLocToken: token },
      data: { customerLat: lat, customerLng: lng, customerLocSharedAt: new Date() },
    });
  }

  async sendWhatsAppNotification(order: any) {
    if (!process.env.FONNTE_TOKEN) return { skipped: true, reason: 'FONNTE_TOKEN tidak dikonfigurasi' };
    try {
      const resp = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { Authorization: process.env.FONNTE_TOKEN },
        body: JSON.stringify({
          target: order.nomorTelepon,
          message: `Halo ${order.namaCustomer}, pesanan Anda (${order.orderId ?? order.id}) sedang diproses.`,
        }),
      });
      return await resp.json();
    } catch (e: any) {
      return { error: e.message };
    }
  }

  async getSales(query: any) {
    const { search, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.noFaktur = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where, skip, take: Number(limit),
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sale.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getSalesSummary(query: any) {
    const { from, to } = query;
    const where: any = {};
    if (from) where.createdAt = { gte: new Date(from) };
    if (to) where.createdAt = { ...where.createdAt, lte: new Date(to) };
    const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({ _sum: { totalHarga: true }, where: { ...where, status: { not: 'cancelled' } } }),
      this.prisma.order.count({ where: { ...where, status: 'pending' } }),
    ]);
    return { totalOrders, totalRevenue: totalRevenue._sum.totalHarga ?? 0, pendingOrders };
  }

  async getSalesList() {
    const SALES = ['Ahmad Santoso', 'Budi Pratama', 'CV Maju Jaya', 'PT Sumber Makmur', 'Dewi Lestari', 'Eko Prasetyo'];
    return SALES;
  }
}
