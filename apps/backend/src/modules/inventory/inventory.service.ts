import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
      this.prisma.product.findMany({
        where, skip, take: Number(limit),
        include: { category: true, unit: true, warehouse: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { data, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getProduct(id: string) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, unit: true, warehouse: true, stockMovements: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
    if (!p) throw new NotFoundException('Produk tidak ditemukan');
    return p;
  }

  async createProduct(dto: any) { return this.prisma.product.create({ data: dto }); }

  async updateProduct(id: string, dto: any) {
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.update({ where: { id }, data: { active: false } });
  }

  async updateStok(id: string, qty: number, type: 'in' | 'out', note?: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    const newStok = type === 'in' ? product.stok + qty : product.stok - qty;
    await Promise.all([
      this.prisma.product.update({ where: { id }, data: { stok: newStok } }),
      this.prisma.stockMovement.create({
        data: { productId: id, type, qty, note: note ?? '' },
      }),
    ]);
    return { stok: newStok };
  }

  async getBrands() {
    const brands = await this.prisma.product.findMany({
      where: { brand: { not: null } },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    return brands.map((b) => b.brand).filter(Boolean);
  }

  async getStockMovements(query: any) {
    const { productId, type, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (productId) where.productId = productId;
    if (type) where.type = type;
    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where, skip, take: Number(limit),
        include: { product: true, warehouse: true },
        orderBy: { createdAt: 'desc' },
      }),
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
      this.prisma.stockOpname.findMany({
        where, skip, take: Number(limit),
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockOpname.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createStockOpname(dto: any) {
    return this.prisma.stockOpname.create({
      data: { date: dto.date, warehouseId: dto.warehouseId, note: dto.note, items: { create: dto.items } },
      include: { items: { include: { product: true } } },
    });
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
    const [totalProducts, totalStokResult] = await Promise.all([
      this.prisma.product.count({ where: { active: true } }),
      this.prisma.product.aggregate({ _sum: { stok: true }, where: { active: true } }),
    ]);
    const lowStock = await this.prisma.product.count({
      where: { active: true, stok: { lte: 5 } },
    });
    return { totalProducts, lowStock, totalStok: totalStokResult._sum.stok ?? 0 };
  }

  async getTransfers(query: any) {
    const { status, fromWarehouseId, toWarehouseId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;
    if (fromWarehouseId) where.fromWarehouseId = fromWarehouseId;
    if (toWarehouseId) where.toWarehouseId = toWarehouseId;
    const [data, total] = await Promise.all([
      this.prisma.stockTransfer.findMany({
        where, skip, take: Number(limit),
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockTransfer.count({ where }),
    ]);
    return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async getTransfer(id: string) {
    const data = await this.prisma.stockTransfer.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
    if (!data) throw new NotFoundException('Transfer tidak ditemukan');
    return { data, message: 'success' };
  }

  async createTransfer(dto: any) {
    if (!dto.fromWarehouseId || !dto.toWarehouseId) throw new BadRequestException('fromWarehouseId dan toWarehouseId harus diisi');
    const { items, ...rest } = dto;
    const count = await this.prisma.stockTransfer.count();
    const noTransfer = dto.noTransfer ?? `ST-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const data = await this.prisma.stockTransfer.create({
      data: { ...rest, noTransfer, status: 'draft', items: items?.length ? { create: items } : undefined },
      include: { items: true },
    });
    return { data, message: 'Transfer stok berhasil dibuat' };
  }

  async confirmTransfer(id: string) {
    const transfer = await this.prisma.stockTransfer.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
    if (!transfer) throw new NotFoundException('Transfer tidak ditemukan');
    if (transfer.status !== 'draft') throw new BadRequestException('Hanya transfer draft yang dapat dikonfirmasi');
    await this.prisma.$transaction(async (prisma) => {
      for (const item of transfer.items) {
        await prisma.product.update({ where: { id: item.productId }, data: { stok: { decrement: Number(item.qty) } } });
      }
      await prisma.stockTransfer.update({ where: { id }, data: { status: 'confirmed', confirmedAt: new Date() } });
    });
    return { data: null, message: 'Transfer berhasil dikonfirmasi. Stok telah dikurangi.' };
  }

  async getAdjustments(query: any) {
    const { status, warehouseId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;
    if (warehouseId) where.warehouseId = warehouseId;
    const [data, total] = await Promise.all([
      this.prisma.stockAdjustment.findMany({
        where, skip, take: Number(limit),
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.stockAdjustment.count({ where }),
    ]);
    return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async getAdjustment(id: string) {
    const data = await this.prisma.stockAdjustment.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
    if (!data) throw new NotFoundException('Penyesuaian stok tidak ditemukan');
    return { data, message: 'success' };
  }

  async createAdjustment(dto: any) {
    const { items, ...rest } = dto;
    const count = await this.prisma.stockAdjustment.count();
    const noAdjustment = dto.noAdjustment ?? `ADJ-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const data = await this.prisma.stockAdjustment.create({
      data: { ...rest, noAdjustment, status: 'draft', items: items?.length ? { create: items } : undefined },
      include: { items: true },
    });
    return { data, message: 'Penyesuaian stok berhasil dibuat' };
  }

  async validateAdjustment(id: string) {
    const adj = await this.prisma.stockAdjustment.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
    if (!adj) throw new NotFoundException('Penyesuaian stok tidak ditemukan');
    if (adj.status !== 'draft') throw new BadRequestException('Hanya penyesuaian draft yang dapat divalidasi');
    await this.prisma.$transaction(async (prisma) => {
      for (const item of adj.items) {
        const diff = Number(item.qtyAktual ?? 0) - Number(item.qtySistem ?? 0);
        if (diff !== 0) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stok: { increment: diff } },
          });
        }
      }
      await prisma.stockAdjustment.update({ where: { id }, data: { status: 'validated', validatedAt: new Date() } });
    });
    return { data: null, message: 'Penyesuaian stok berhasil divalidasi' };
  }

  async getReorderRules(query: any) {
    const { productId, active } = query;
    const where: any = {};
    if (productId) where.productId = productId;
    if (active !== undefined) where.active = active === 'true' || active === true;
    const data = await this.prisma.reorderRule.findMany({
      where,
      include: { product: { select: { id: true, name: true, stok: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { data, message: 'success' };
  }

  async createReorderRule(dto: any) {
    if (!dto.productId) throw new BadRequestException('productId harus diisi');
    const data = await this.prisma.reorderRule.create({ data: dto });
    return { data, message: 'Reorder rule berhasil dibuat' };
  }

  async updateReorderRule(id: string, dto: any) {
    const data = await this.prisma.reorderRule.update({ where: { id }, data: dto });
    return { data, message: 'Reorder rule berhasil diupdate' };
  }

  async deleteReorderRule(id: string) {
    await this.prisma.reorderRule.delete({ where: { id } });
    return { data: null, message: 'Reorder rule berhasil dihapus' };
  }
}
