import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../database/prisma.service.js';
import { firstValueFrom } from 'rxjs';

const SPM_BRAND_PIC: Record<string, string> = {
  'ASPIRA': 'Ahmad Santoso', 'FEDERAL': 'Budi Pratama', 'YAMAHA': 'CV Maju Jaya',
  'HONDA': 'PT Sumber Makmur', 'SUZUKI': 'Dewi Lestari', 'KAWASAKI': 'Eko Prasetyo',
};

@Injectable()
export class KledoService {
  private readonly logger = new Logger(KledoService.name);
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(
    @Inject(HttpService) private readonly http: HttpService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {
    this.baseUrl = process.env.KLEDO_BASE_URL || 'https://app.kledo.com/api/v1';
    this.token = process.env.KLEDO_TOKEN || '';
  }

  private get headers() {
    return { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' };
  }

  async getStatus() {
    if (!this.token) return { connected: false, message: 'KLEDO_TOKEN tidak dikonfigurasi' };
    try {
      await firstValueFrom(this.http.get(`${this.baseUrl}/contacts?per_page=1`, { headers: this.headers }));
      return { connected: true, message: 'Kledo terhubung' };
    } catch (e: any) {
      return { connected: false, message: e.message };
    }
  }

  async getProducts(query: any = {}) {
    const { page = 1, per_page = 50, search } = query;
    const params: any = { page, per_page };
    if (search) params.name = search;
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/finance/products`, { headers: this.headers, params }));
    return res.data;
  }

  async getContacts(query: any = {}) {
    const { page = 1, per_page = 50, search } = query;
    const params: any = { page, per_page };
    if (search) params.name = search;
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/contacts`, { headers: this.headers, params }));
    return res.data;
  }

  async getInvoices(query: any = {}) {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/finance/invoices`, { headers: this.headers, params: query }));
    return res.data;
  }

  getSpmBrands() {
    return Object.entries(SPM_BRAND_PIC).map(([brand, pic]) => ({ brand, pic }));
  }

  isSpmBrand(brand: string) {
    return brand?.toUpperCase() in SPM_BRAND_PIC;
  }

  withMargin(price: number, margin = 0.15) {
    return Math.ceil(price * (1 + margin));
  }

  async syncProducts() {
    const log = await this.prisma.kledoSyncLog.create({
      data: { type: 'products', status: 'running', message: 'Sync produk dimulai' },
    });
    try {
      const products = await this.getProducts({ per_page: 100 });
      const list: any[] = products?.data ?? [];
      for (const p of list) {
        const sku = p.code ?? p.id?.toString() ?? '';
        if (!sku) continue;
        await this.prisma.product.upsert({
          where: { sku },
          update: { kledoProductId: p.id?.toString(), hargaKledo: p.price ?? 0 },
          create: {
            sku,
            name: p.name ?? sku,
            kledoProductId: p.id?.toString(),
            hargaKledo: p.price ?? 0,
          },
        });
      }
      await this.prisma.kledoSyncLog.update({
        where: { id: log.id },
        data: { status: 'success', message: `${list.length} produk disync` },
      });
      return { success: true, synced: list.length };
    } catch (err: any) {
      await this.prisma.kledoSyncLog.update({
        where: { id: log.id },
        data: { status: 'error', message: err.message },
      });
      throw err;
    }
  }

  async syncNow() {
    const log = await this.prisma.kledoSyncLog.create({ data: { type: 'manual', status: 'running', message: 'Sync dimulai' } });
    try {
      const products = await this.getProducts({ per_page: 100 });
      await this.prisma.kledoSyncLog.update({
        where: { id: log.id },
        data: { status: 'success', message: `Sync selesai: ${products?.data?.length ?? 0} produk`, response: products },
      });
      return { success: true, synced: products?.data?.length ?? 0 };
    } catch (e: any) {
      await this.prisma.kledoSyncLog.update({ where: { id: log.id }, data: { status: 'error', message: e.message } });
      throw e;
    }
  }

  async autoSync() {
    await Promise.allSettled([this.syncProducts()]);
    return { message: 'Auto sync selesai' };
  }

  async getSyncLogs(query: any) {
    const { page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      this.prisma.kledoSyncLog.findMany({ skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      this.prisma.kledoSyncLog.count(),
    ]);
    return { data, total };
  }
}
