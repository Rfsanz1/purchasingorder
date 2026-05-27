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
    this.baseUrl = process.env.KLEDO_BASE_URL || 'https://api.kledo.com/api/v1';
    this.token = process.env.KLEDO_TOKEN || '';
  }

  private get headers() {
    return { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' };
  }

  async getStatus() {
    if (!this.token) return { connected: false, message: 'KLEDO_TOKEN tidak dikonfigurasi' };
    try {
      await firstValueFrom(this.http.get(`${this.baseUrl}/finance/products?per_page=1`, { headers: this.headers }));
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
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/finance/contacts`, { headers: this.headers, params }));
    return res.data;
  }

  async getInvoices(query: any = {}) {
    const res = await firstValueFrom(this.http.get(`${this.baseUrl}/finance/invoices`, { headers: this.headers, params: query }));
    return res.data;
  }

  async findOrCreateContact(name: string, phone?: string): Promise<number> {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.baseUrl}/finance/contacts`, {
          headers: this.headers,
          params: { per_page: 100 },
        }),
      );
      const contacts: any[] = res.data?.data?.data ?? [];
      const found = contacts.find(
        (c: any) =>
          c.name?.toLowerCase() === name?.toLowerCase() ||
          (phone && c.phone && c.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')),
      );
      if (found) return found.id;
    } catch (e) {
      this.logger.warn('Gagal cari contact Kledo: ' + e);
    }

    try {
      const createRes = await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/finance/contacts`,
          { name, phone: phone ?? null, type_id: 4, is_customer: 1 },
          { headers: this.headers },
        ),
      );
      const newId = createRes.data?.data?.id;
      if (newId) return newId;
    } catch (e) {
      this.logger.warn('Gagal buat contact Kledo: ' + e);
    }

    return 2806;
  }

  async createInvoice(dto: {
    namaCustomer: string;
    noHp?: string;
    memo?: string;
    orderId?: number | string;
    items: Array<{
      kledoProductId?: string | null;
      nama: string;
      qty: number;
      harga: number;
      unitId?: number;
    }>;
    dueDays?: number;
  }) {
    if (!this.token) {
      return { success: false, message: 'KLEDO_TOKEN tidak dikonfigurasi' };
    }

    try {
      const contactId = await this.findOrCreateContact(dto.namaCustomer, dto.noHp);

      const today = new Date();
      const transDate = today.toISOString().split('T')[0];
      const dueDate = new Date(today.getTime() + (dto.dueDays ?? 30) * 86400000)
        .toISOString()
        .split('T')[0];

      const items = dto.items
        .filter((it) => it.kledoProductId)
        .map((it) => {
          const amount = it.qty * it.harga;
          return {
            finance_account_id: Number(it.kledoProductId),
            qty: it.qty,
            price: it.harga,
            amount,
            discount_percent: 0,
            unit_id: it.unitId ?? 1,
            desc: it.nama,
          };
        });

      if (items.length === 0) {
        return { success: false, message: 'Tidak ada produk dengan Kledo Product ID — invoice tidak dibuat' };
      }

      const memo = dto.memo ?? (dto.orderId ? `Order #${dto.orderId} - ${dto.namaCustomer}` : dto.namaCustomer);

      const payload = {
        trans_date: transDate,
        due_date: dueDate,
        contact_id: contactId,
        status_id: 3,
        term_id: 1,
        include_tax: 0,
        memo,
        items,
      };

      const res = await firstValueFrom(
        this.http.post(`${this.baseUrl}/finance/invoices`, payload, { headers: this.headers }),
      );

      const kledoId = res.data?.id ?? res.data?.data?.id;
      this.logger.log(`Invoice Kledo berhasil: id=${kledoId} order=${dto.orderId}`);
      return { success: true, kledoInvoiceId: kledoId, message: res.data?.message ?? 'Tagihan berhasil dibuat' };
    } catch (e: any) {
      const msg = e.response?.data?.message ?? e.message;
      this.logger.error('Gagal buat invoice Kledo: ' + msg);
      return { success: false, message: msg };
    }
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
