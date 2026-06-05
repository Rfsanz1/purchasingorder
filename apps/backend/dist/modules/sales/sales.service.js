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
var SalesService_1;
import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { KledoService } from '../kledo/kledo.service.js';
let SalesService = SalesService_1 = class SalesService {
    prisma;
    kledo;
    logger = new Logger(SalesService_1.name);
    constructor(prisma, kledo) {
        this.prisma = prisma;
        this.kledo = kledo;
    }
    async getOrders(query) {
        const { search, status, salesName, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search)
            where.namaCustomer = { contains: search, mode: 'insensitive' };
        if (status)
            where.status = status;
        if (salesName)
            where.salesName = salesName;
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({ where, skip, take: Number(limit), include: { customer: true, orderItems: { include: { product: true } } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.order.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getOrder(id) {
        const o = await this.prisma.order.findUnique({ where: { id }, include: { customer: true, orderItems: { include: { product: true } } } });
        if (!o)
            throw new NotFoundException('Order tidak ditemukan');
        return o;
    }
    async createOrder(dto) {
        const { items, ...orderData } = dto;
        const dbItems = (items ?? []).map((it) => ({
            nama: it.nama ?? it.name ?? '',
            qty: Number(it.qty) || 1,
            harga: it.harga ?? it.price ?? 0,
            subtotal: it.subtotal ?? (it.qty * (it.harga ?? it.price ?? 0)),
            ...(it.productId ? { productId: it.productId } : {}),
        }));
        const order = await this.prisma.order.create({
            data: { ...orderData, items: items ?? [], orderItems: dbItems.length ? { create: dbItems } : undefined },
            include: { orderItems: { include: { product: true } } },
        });
        this.pushInvoiceToKledo(order, items ?? []).catch((e) => this.logger.warn('Kledo push gagal: ' + e.message));
        return order;
    }
    async pushInvoiceToKledo(order, items) {
        const kledoItems = items.map((it) => ({
            kledoProductId: it.kledoProductId ?? it.product?.kledoProductId ?? null,
            nama: it.nama ?? it.name ?? '',
            qty: Number(it.qty) || 1,
            harga: Number(it.harga) || Number(it.price) || 0,
            unitId: it.unitId ?? 1,
        }));
        const result = await this.kledo.createInvoice({ namaCustomer: order.namaCustomer, noHp: order.noHp, orderId: order.id, items: kledoItems });
        if (result.success && result.kledoInvoiceId) {
            await this.prisma.order.update({ where: { id: order.id }, data: { kledoInvoiceId: result.kledoInvoiceId?.toString() } }).catch(() => null);
        }
        return result;
    }
    async updateOrder(id, dto) { return this.prisma.order.update({ where: { id }, data: dto }); }
    async deleteOrder(id) { return this.prisma.order.update({ where: { id }, data: { status: 'cancelled' } }); }
    async updatePengiriman(id, dto) { return this.prisma.order.update({ where: { id }, data: dto }); }
    async uploadBuktiTransfer(id, base64Data) { return this.prisma.order.update({ where: { id }, data: { fotoPengiriman: base64Data } }); }
    async getCustomerLocation(token) {
        const order = await this.prisma.order.findFirst({ where: { lokasiToken: token }, select: { lokasiLat: true, lokasiLng: true, namaCustomer: true } });
        if (!order)
            throw new NotFoundException('Token tidak valid');
        return order;
    }
    async saveCustomerLocation(token, lat, lng) {
        return this.prisma.order.updateMany({ where: { lokasiToken: token }, data: { lokasiLat: lat, lokasiLng: lng, lokasiUpdatedAt: new Date() } });
    }
    async sendWhatsAppNotification(order) {
        if (!process.env.FONNTE_TOKEN)
            return { skipped: true, reason: 'FONNTE_TOKEN tidak dikonfigurasi' };
        try {
            const resp = await fetch('https://api.fonnte.com/send', { method: 'POST', headers: { Authorization: process.env.FONNTE_TOKEN }, body: JSON.stringify({ target: order.nomorTelepon, message: `Halo ${order.namaCustomer}, pesanan Anda (${order.orderId ?? order.id}) sedang diproses.` }) });
            return await resp.json();
        }
        catch (e) {
            return { error: e.message };
        }
    }
    async getSales(query) {
        const { search, status, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search)
            where.noFaktur = { contains: search, mode: 'insensitive' };
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.sale.findMany({ where, skip, take: Number(limit), include: { customer: true, items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.sale.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getSalesSummary(query) {
        const { from, to } = query;
        const where = {};
        if (from)
            where.createdAt = { gte: new Date(from) };
        if (to)
            where.createdAt = { ...where.createdAt, lte: new Date(to) };
        const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
            this.prisma.order.count({ where }),
            this.prisma.order.aggregate({ _sum: { totalHarga: true }, where: { ...where, status: { not: 'cancelled' } } }),
            this.prisma.order.count({ where: { ...where, status: 'pending' } }),
        ]);
        return { totalOrders, totalRevenue: totalRevenue._sum.totalHarga ?? 0, pendingOrders };
    }
    async getSalesList() { return ['Ahmad Santoso', 'Budi Pratama', 'CV Maju Jaya', 'PT Sumber Makmur', 'Dewi Lestari', 'Eko Prasetyo']; }
    // ─── QUOTATIONS ──────────────────────────────────────────────────────────────
    async getQuotations(query) {
        const { search, status, customerId, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { deletedAt: null };
        if (status)
            where.status = status;
        if (customerId)
            where.customerId = customerId;
        if (search)
            where.OR = [{ nomorQuotation: { contains: search, mode: 'insensitive' } }];
        const [data, total] = await Promise.all([
            this.prisma.salesQuotation.findMany({ where, skip, take: Number(limit), include: { customer: { select: { id: true, name: true } }, items: true }, orderBy: { createdAt: 'desc' } }),
            this.prisma.salesQuotation.count({ where }),
        ]);
        return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
    }
    async getQuotation(id) {
        const data = await this.prisma.salesQuotation.findUnique({ where: { id }, include: { customer: true, items: { include: { product: true } } } });
        if (!data)
            throw new NotFoundException('Quotation tidak ditemukan');
        return { data, message: 'success' };
    }
    async createQuotation(dto) {
        if (!dto.customerId)
            throw new BadRequestException('customerId harus diisi');
        const counter = await this.prisma.salesQuotation.count();
        const nomorQuotation = dto.nomorQuotation ?? `QT-${new Date().getFullYear()}${String(counter + 1).padStart(4, '0')}`;
        const { items, ...rest } = dto;
        const data = await this.prisma.salesQuotation.create({ data: { ...rest, nomorQuotation, items: items?.length ? { create: items } : undefined }, include: { items: true } });
        return { data, message: 'Quotation berhasil dibuat' };
    }
    async updateQuotation(id, dto) {
        await this.getQuotation(id);
        const { items, ...rest } = dto;
        const data = await this.prisma.salesQuotation.update({ where: { id }, data: rest, include: { items: true } });
        return { data, message: 'Quotation berhasil diupdate' };
    }
    async deleteQuotation(id) {
        await this.prisma.salesQuotation.update({ where: { id }, data: { deletedAt: new Date() } });
        return { data: null, message: 'Quotation berhasil dihapus' };
    }
    async confirmQuotation(id) {
        const q = await this.getQuotation(id);
        if (!['draft', 'sent'].includes(q.data.status))
            throw new BadRequestException('Hanya quotation draft atau terkirim yang bisa dikonfirmasi');
        const data = await this.prisma.salesQuotation.update({ where: { id }, data: { status: 'confirmed' } });
        return { data, message: 'Quotation berhasil dikonfirmasi' };
    }
    async convertQuotationToInvoice(id) {
        const q = await this.getQuotation(id);
        const quotation = q.data;
        const count = await this.prisma.invoice.count();
        const noInvoice = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
        const items = quotation.items.map((it) => ({
            productId: it.productId,
            nama: it.productName ?? it.product?.name ?? '',
            qty: Number(it.qty),
            harga: Number(it.hargaSatuan),
            subtotal: Number(it.subtotal),
        }));
        const invoice = await this.prisma.invoice.create({
            data: {
                noInvoice,
                customerId: quotation.customerId,
                salesName: quotation.salesName,
                subtotal: quotation.subtotal,
                diskon: quotation.discount,
                pajak: quotation.tax,
                grandTotal: quotation.total,
                status: 'draft',
                notes: quotation.note,
                items: items.length ? { create: items } : undefined,
            },
            include: { items: true, customer: { select: { id: true, name: true } } },
        });
        await this.prisma.salesQuotation.update({ where: { id }, data: { status: 'converted' } });
        return { data: invoice, message: 'Quotation berhasil dikonversi ke invoice' };
    }
    async convertQuotationToOrder(id) {
        const q = await this.getQuotation(id);
        const quotation = q.data;
        const items = quotation.items.map((it) => ({ productId: it.productId, productName: it.productName, qty: it.qty, hargaSatuan: it.hargaSatuan, subtotal: it.subtotal }));
        const order = await this.createOrder({ customerId: quotation.customerId, salesName: quotation.salesName, items, quotationId: quotation.id });
        await this.prisma.salesQuotation.update({ where: { id }, data: { status: 'converted' } });
        return { data: order, message: 'Quotation berhasil dikonversi ke order' };
    }
    async sendQuotationWhatsApp(id, dto) {
        const q = await this.getQuotation(id);
        const quotation = q.data;
        const phone = dto?.phone ?? quotation.customer?.phone ?? '';
        if (!phone)
            return { message: 'Tidak ada nomor telepon' };
        const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
        const message = dto?.message ?? `Halo ${quotation.customer?.name ?? 'Pelanggan'}, kami mengirimkan penawaran ${quotation.nomorQuotation} senilai ${fmt(Number(quotation.total))}. Berlaku hingga ${quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString('id-ID') : '-'}. Terima kasih.`;
        if (process.env.FONNTE_TOKEN) {
            try {
                const resp = await fetch('https://api.fonnte.com/send', { method: 'POST', headers: { Authorization: process.env.FONNTE_TOKEN }, body: JSON.stringify({ target: phone, message }) });
                return { data: await resp.json(), message: 'WhatsApp berhasil dikirim' };
            }
            catch (e) {
                return { error: e.message };
            }
        }
        return { skipped: true, preview: message };
    }
    async sendQuotationEmail(id, dto) {
        await this.getQuotation(id);
        return { skipped: true, message: 'Email service belum dikonfigurasi. Gunakan SMTP atau third-party provider.' };
    }
    // ─── SALES RETURNS ───────────────────────────────────────────────────────────
    async getSalesReturns(query) {
        const { orderId, invoiceId, status, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (orderId)
            where.orderId = Number(orderId);
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.salesReturn.findMany({ where, skip, take: Number(limit), include: { customer: { select: { id: true, name: true } }, items: true }, orderBy: { createdAt: 'desc' } }),
            this.prisma.salesReturn.count({ where }),
        ]);
        return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
    }
    async getSalesReturn(id) {
        const data = await this.prisma.salesReturn.findUnique({ where: { id }, include: { customer: true, items: true } });
        if (!data)
            throw new NotFoundException('Sales return tidak ditemukan');
        return { data, message: 'success' };
    }
    async createSalesReturn(dto) {
        if (!dto.customerId)
            throw new BadRequestException('customerId harus diisi');
        const { items, ...rest } = dto;
        const counter = await this.prisma.salesReturn.count();
        const noReturn = dto.noReturn ?? `SR-${new Date().getFullYear()}${String(counter + 1).padStart(4, '0')}`;
        const data = await this.prisma.salesReturn.create({ data: { ...rest, noReturn, items: items?.length ? { create: items } : undefined }, include: { items: true } });
        return { data, message: 'Sales return berhasil dibuat' };
    }
    async updateSalesReturn(id, dto) {
        await this.getSalesReturn(id);
        const { items, ...rest } = dto;
        const data = await this.prisma.salesReturn.update({ where: { id }, data: rest, include: { items: true } });
        return { data, message: 'Sales return berhasil diupdate' };
    }
    async validateSalesReturn(id) {
        const r = await this.getSalesReturn(id);
        const ret = r.data;
        if (ret.status === 'validated')
            throw new BadRequestException('Return sudah divalidasi');
        for (const item of ret.items) {
            if (item.productId) {
                await this.prisma.product.update({ where: { id: item.productId }, data: { stok: { increment: item.qty } } }).catch(() => null);
            }
        }
        const data = await this.prisma.salesReturn.update({ where: { id }, data: { status: 'validated' } });
        return { data, message: 'Sales return berhasil divalidasi dan stok dikembalikan' };
    }
    // ─── PRICELISTS ──────────────────────────────────────────────────────────────
    async getPricelists(query) {
        const { search, active, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (active !== undefined)
            where.active = active === 'true' || active === true;
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        const [data, total] = await Promise.all([
            this.prisma.pricelist.findMany({ where, skip, take: Number(limit), include: { items: true }, orderBy: { name: 'asc' } }),
            this.prisma.pricelist.count({ where }),
        ]);
        return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
    }
    async getPricelist(id) {
        const data = await this.prisma.pricelist.findUnique({ where: { id }, include: { items: true } });
        if (!data)
            throw new NotFoundException('Pricelist tidak ditemukan');
        return { data, message: 'success' };
    }
    async createPricelist(dto) {
        if (!dto.name && !dto.nama)
            throw new BadRequestException('Nama pricelist harus diisi');
        const { items, ...rest } = dto;
        if (rest.nama && !rest.name) {
            rest.name = rest.nama;
            delete rest.nama;
        }
        const data = await this.prisma.pricelist.create({ data: { ...rest, items: items?.length ? { create: items } : undefined }, include: { items: true } });
        return { data, message: 'Pricelist berhasil dibuat' };
    }
    async updatePricelist(id, dto) {
        await this.getPricelist(id);
        const { items, ...rest } = dto;
        const data = await this.prisma.pricelist.update({ where: { id }, data: rest, include: { items: true } });
        return { data, message: 'Pricelist berhasil diupdate' };
    }
    async deletePricelist(id) {
        await this.prisma.pricelist.delete({ where: { id } });
        return { data: null, message: 'Pricelist berhasil dihapus' };
    }
    async getPricelistItems(id) {
        await this.getPricelist(id);
        const data = await this.prisma.pricelistItem.findMany({ where: { pricelistId: id } });
        return { data, message: 'success' };
    }
    async addPricelistItem(id, dto) {
        await this.getPricelist(id);
        const data = await this.prisma.pricelistItem.create({ data: { ...dto, pricelistId: id } });
        return { data, message: 'Item berhasil ditambahkan' };
    }
};
SalesService = SalesService_1 = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __param(1, Inject(KledoService)),
    __metadata("design:paramtypes", [PrismaService,
        KledoService])
], SalesService);
export { SalesService };
