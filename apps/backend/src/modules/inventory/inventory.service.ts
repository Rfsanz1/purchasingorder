import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class InventoryService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getProducts(query: any) {
    const { search, categoryId, warehouseId, active, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (categoryId) where.categoryId = categoryId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (active !== undefined) where.active = active === 'true';
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: Number(limit), include: { category: true, unit: true, warehouse: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getProduct(id: string) {
    const p = await this.prisma.product.findUnique({ where: { id }, include: { category: true, unit: true, warehouse: true, stockMovements: { take: 10, orderBy: { createdAt: 'desc' } } } });
    if (!p) throw new NotFoundException('Produk tidak ditemukan');
    return p;
  }

  async createProduct(dto: any) {
    return this.prisma.product.create({ data: dto });
  }

  async updateProduct(id: string, dto: any) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.update({ where: { id }, data: { active: false } });
  }

  async getStockMovements(query: any) {
    const { productId, type, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (productId) where.productId = productId;
    if (type) where.type = type;
    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({ where, skip, take: Number(limit), include: { product: true, warehouse: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.stockMovement.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getStockOpnames(query: any) {
    const { status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.stockOpname.findMany({ where, skip, take: Number(limit), include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.stockOpname.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createStockOpname(dto: any) {
    return this.prisma.stockOpname.create({ data: { date: dto.date, warehouseId: dto.warehouseId, note: dto.note, items: { create: dto.items } } });
  }

  async getWarehouses() {
    return this.prisma.warehouse.findMany({ where: { active: true }, orderBy: { name: 'asc' } });
  }

  async getCategories() {
    return this.prisma.productCategory.findMany({ orderBy: { name: 'asc' } });
  }

  async getUnits() {
    return this.prisma.productUnit.findMany({ orderBy: { name: 'asc' } });
  }

  async getStats() {
    const [totalProducts, lowStock, totalValue] = await Promise.all([
      this.prisma.product.count({ where: { active: true } }),
      this.prisma.product.count({ where: { active: true, stok: { lte: this.prisma.product.fields.stokMinimum } } }).catch(() => 0),
      this.prisma.product.aggregate({ _sum: { stok: true }, where: { active: true } }),
    ]);
    return { totalProducts, lowStock, totalStok: totalValue._sum.stok ?? 0 };
  }
}
