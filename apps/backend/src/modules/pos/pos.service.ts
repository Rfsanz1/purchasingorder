import { Inject, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PosService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async login(username: string, password: string) {
    const user = await this.prisma.posUser.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException('Username/password salah');
    const session = await this.prisma.posCashierSession.create({ data: { posUserId: user.id, modalAwal: 0 } });
    return { user: { id: user.id, name: user.name, role: user.role }, sessionId: session.id };
  }

  async getProducts(query: any) {
    const { search, categoryId, page = 1, limit = 50 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { active: true };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (categoryId) where.categoryId = categoryId;
    const [data, total] = await Promise.all([
      this.prisma.posProduct.findMany({ where, skip, take: Number(limit), include: { category: true }, orderBy: { name: 'asc' } }),
      this.prisma.posProduct.count({ where }),
    ]);
    return { data, total };
  }

  async getSales(query: any) {
    const { sessionId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (sessionId) where.sessionId = sessionId;
    const [data, total] = await Promise.all([
      this.prisma.posSale.findMany({ where, skip, take: Number(limit), include: { items: { include: { posProduct: true } }, posUser: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.posSale.count({ where }),
    ]);
    return { data, total };
  }

  async createSale(dto: any) {
    const { items, ...saleData } = dto;
    const noStruk = `STR/${new Date().getFullYear()}/${String(Date.now()).slice(-6)}`;
    const kembalian = Number(saleData.bayar) - Number(saleData.grandTotal);
    return this.prisma.posSale.create({
      data: { ...saleData, noStruk, kembalian, items: { create: items ?? [] } },
      include: { items: { include: { posProduct: true } } },
    });
  }

  async getDashboard() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [todaySales, totalRevenue, openSessions] = await Promise.all([
      this.prisma.posSale.count({ where: { createdAt: { gte: today } } }),
      this.prisma.posSale.aggregate({ _sum: { grandTotal: true }, where: { createdAt: { gte: today } } }),
      this.prisma.posCashierSession.count({ where: { status: 'open' } }),
    ]);
    return { todaySales, todayRevenue: totalRevenue._sum.grandTotal ?? 0, openSessions };
  }

  async getCategories() { return this.prisma.posCategory.findMany({ where: { active: true }, orderBy: { name: 'asc' } }); }
  async createProduct(dto: any) { return this.prisma.posProduct.create({ data: dto }); }
  async updateProduct(id: string, dto: any) { return this.prisma.posProduct.update({ where: { id }, data: dto }); }
}
