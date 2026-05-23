import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class PurchasingService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getPurchaseOrders(query: any) {
    const { search, status, supplierId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.noPo = { contains: search, mode: 'insensitive' };
    if (status) where.status = status;
    if (supplierId) where.supplierId = supplierId;
    const [data, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({ where, skip, take: Number(limit), include: { supplier: true, warehouse: true, items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.purchaseOrder.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getPurchaseOrder(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({ where: { id }, include: { supplier: true, warehouse: true, items: { include: { product: true } }, goodsReceipts: true } });
    if (!po) throw new NotFoundException('PO tidak ditemukan');
    return po;
  }

  async createPurchaseOrder(dto: any) {
    const { items, ...poData } = dto;
    const noPo = `PO/${new Date().getFullYear()}/${String(Date.now()).slice(-5)}`;
    return this.prisma.purchaseOrder.create({ data: { ...poData, noPo, items: { create: items ?? [] } } });
  }

  async updatePurchaseOrder(id: string, dto: any) {
    return this.prisma.purchaseOrder.update({ where: { id }, data: dto });
  }

  async approvePurchaseOrder(id: string, userId: string) {
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status: 'approved', approvedBy: userId, approvedAt: new Date() } });
  }

  async cancelPurchaseOrder(id: string) {
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status: 'cancelled' } });
  }

  async getGoodsReceipts(query: any) {
    const { poId, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (poId) where.purchaseOrderId = poId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.goodsReceipt.findMany({ where, skip, take: Number(limit), include: { purchaseOrder: { include: { supplier: true } }, items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.goodsReceipt.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createGoodsReceipt(dto: any) {
    const { items, ...grData } = dto;
    const noGr = `GR/${new Date().getFullYear()}/${String(Date.now()).slice(-5)}`;
    return this.prisma.goodsReceipt.create({ data: { ...grData, noGr, items: { create: items ?? [] } } });
  }

  async getStats() {
    const [total, pending, approved] = await Promise.all([
      this.prisma.purchaseOrder.count(),
      this.prisma.purchaseOrder.count({ where: { status: 'draft' } }),
      this.prisma.purchaseOrder.count({ where: { status: 'approved' } }),
    ]);
    const totalValue = await this.prisma.purchaseOrder.aggregate({ _sum: { totalHarga: true } });
    return { total, pending, approved, totalValue: totalValue._sum.totalHarga ?? 0 };
  }

  async getSuppliers(query: any) {
    const { search, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { active: true };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const [data, total] = await Promise.all([
      this.prisma.supplier.findMany({ where, skip, take: Number(limit), orderBy: { name: 'asc' } }),
      this.prisma.supplier.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createSupplier(dto: any) { return this.prisma.supplier.create({ data: dto }); }
  async updateSupplier(id: string, dto: any) { return this.prisma.supplier.update({ where: { id }, data: dto }); }
  async deleteSupplier(id: string) { return this.prisma.supplier.update({ where: { id }, data: { active: false } }); }
}
