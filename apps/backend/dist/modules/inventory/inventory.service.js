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
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { SettingsService } from '../settings/settings.service.js';
import { JournalService } from '../finance/journal.service.js';
let InventoryService = class InventoryService {
    prisma;
    settings;
    journalSvc;
    constructor(prisma, settings, journalSvc) {
        this.prisma = prisma;
        this.settings = settings;
        this.journalSvc = journalSvc;
    }
    async getProducts(query) {
        const { search, categoryId, warehouseId, active, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (categoryId)
            where.categoryId = categoryId;
        if (warehouseId)
            where.warehouseId = warehouseId;
        if (active !== undefined)
            where.active = active === 'true';
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
    async getProduct(id) {
        const p = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true, unit: true, warehouse: true, stockMovements: { take: 10, orderBy: { createdAt: 'desc' } } },
        });
        if (!p)
            throw new NotFoundException('Produk tidak ditemukan');
        return p;
    }
    // ----------------- Product Variants -----------------
    async getVariants(productId) {
        return this.prisma.productVariant.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
    }
    async createVariant(productId, dto) {
        return this.prisma.productVariant.create({ data: { ...dto, productId } });
    }
    async updateVariant(productId, variantId, dto) {
        const v = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
        if (!v || v.productId !== productId)
            throw new NotFoundException('Variant tidak ditemukan');
        return this.prisma.productVariant.update({ where: { id: variantId }, data: dto });
    }
    async deleteVariant(productId, variantId) {
        const v = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
        if (!v || v.productId !== productId)
            throw new NotFoundException('Variant tidak ditemukan');
        return this.prisma.productVariant.delete({ where: { id: variantId } });
    }
    // ----------------- Product Bundle -----------------
    async getBundleComponents(productId) {
        return this.prisma.productBundle.findMany({ where: { productId }, include: { component: true } });
    }
    async addBundleComponent(productId, dto) {
        return this.prisma.productBundle.create({ data: { productId, componentId: dto.componentId, qty: dto.qty } });
    }
    // ----------------- Tier Prices -----------------
    async getTierPrices(productId) {
        return this.prisma.productTierPrice.findMany({ where: { productId }, orderBy: { minQty: 'asc' } });
    }
    async addTierPrice(productId, dto) {
        return this.prisma.productTierPrice.create({ data: { productId, minQty: dto.minQty, maxQty: dto.maxQty, price: dto.price, currency: dto.currency ?? 'IDR' } });
    }
    // ----------------- Unit Conversions -----------------
    async getUnitConversions() {
        return this.prisma.unitConversion.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async addUnitConversion(dto) {
        return this.prisma.unitConversion.create({ data: dto });
    }
    // ----------------- Import / Export (basic stubs) -----------------
    async importProducts(file) {
        // accept base64 string or buffer
        const buf = typeof file === 'string' ? Buffer.from(file, 'base64') : Buffer.from(file);
        const { excelBufferToProducts } = await import('./utils/excel.util.js');
        const rows = await excelBufferToProducts(buf);
        const created = [];
        for (const r of rows) {
            // try update by sku or create
            const existing = r.sku ? await this.prisma.product.findFirst({ where: { sku: r.sku } }) : null;
            if (existing) {
                await this.prisma.product.update({ where: { id: existing.id }, data: { name: r.name ?? existing.name, hargaJual: r.price ?? existing.hargaJual } });
                created.push({ id: existing.id, updated: true });
            }
            else {
                const p = await this.prisma.product.create({ data: { sku: r.sku ?? undefined, name: r.name ?? `Imported ${Date.now()}`, hargaJual: r.price ?? 0, stok: Math.round(r.stock ?? 0) } });
                created.push({ id: p.id, created: true });
            }
        }
        return { message: 'Import selesai', data: created };
    }
    async exportProducts(query) {
        const products = await this.prisma.product.findMany({ include: { unit: true } });
        const { productsToExcelBuffer } = await import('./utils/excel.util.js');
        const buf = await productsToExcelBuffer(products);
        return { filename: `products-${Date.now()}.xlsx`, content: buf.toString('base64') };
    }
    async importTemplate() {
        const { productsToExcelBuffer } = await import('./utils/excel.util.js');
        const buf = await productsToExcelBuffer([]);
        return { filename: 'products-template.xlsx', content: buf.toString('base64') };
    }
    // ----------------- Lots / Serials -----------------
    async getLots(query) {
        const { productId, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (productId)
            where.productId = productId;
        const [data, total] = await Promise.all([
            this.prisma.stockLot.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
            this.prisma.stockLot.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getLot(id) {
        const l = await this.prisma.stockLot.findUnique({ where: { id } });
        if (!l)
            throw new NotFoundException('Lot tidak ditemukan');
        return l;
    }
    async createLot(dto) {
        return this.prisma.stockLot.create({ data: dto });
    }
    async getLotTrace(id) {
        // Simple trace: find lot and related stock movements
        const lot = await this.prisma.stockLot.findUnique({ where: { id } });
        if (!lot)
            throw new NotFoundException('Lot tidak ditemukan');
        const movements = await this.prisma.stockMovement.findMany({ where: { referenceId: lot.referenceId }, orderBy: { createdAt: 'asc' } });
        return { lot, movements };
    }
    async getProductLots(productId) {
        return this.prisma.stockLot.findMany({ where: { productId }, orderBy: { createdAt: 'desc' } });
    }
    async generateTransferPdf(id) {
        const transfer = await this.prisma.stockTransfer.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
        if (!transfer)
            throw new NotFoundException('Transfer tidak ditemukan');
        const { transferToPdfBuffer } = await import('./utils/pdf.util.js');
        const buf = await transferToPdfBuffer(transfer);
        return { filename: `transfer-${transfer.noTransfer ?? id}.pdf`, content: buf.toString('base64') };
    }
    async createProduct(dto) { return this.prisma.product.create({ data: dto }); }
    async updateProduct(id, dto) {
        return this.prisma.product.update({ where: { id }, data: dto });
    }
    async deleteProduct(id) {
        return this.prisma.product.update({ where: { id }, data: { active: false } });
    }
    async updateStok(id, qty, type, note) {
        // legacy: update global stok on product
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new NotFoundException('Produk tidak ditemukan');
        const newStok = type === 'in' ? product.stok + qty : product.stok - qty;
        await Promise.all([
            this.prisma.product.update({ where: { id }, data: { stok: newStok } }),
            this.prisma.stockMovement.create({ data: { productId: id, type, qty, note: note ?? '' } }),
        ]);
        return { stok: newStok };
    }
    // adjust per-warehouse stock and keep product.stok in sync (aggregate)
    async adjustWarehouseStock(productId, warehouseId, delta) {
        // if no warehouseId, update global product.stok only
        if (!warehouseId) {
            const p = await this.prisma.product.findUnique({ where: { id: productId } });
            if (!p)
                throw new NotFoundException('Produk tidak ditemukan');
            await this.prisma.product.update({ where: { id: productId }, data: { stok: p.stok + delta } });
            return;
        }
        const whereUnique = { productId_warehouseId: { productId, warehouseId } };
        const existing = await this.prisma.productWarehouseStock.findUnique({ where: { productId_warehouseId: { productId, warehouseId } } }).catch(() => null);
        if (existing) {
            await this.prisma.productWarehouseStock.update({
                where: { productId_warehouseId: { productId, warehouseId } },
                data: { qty: { increment: delta } },
            });
        }
        else {
            await this.prisma.productWarehouseStock.create({ data: { productId, warehouseId, qty: delta } });
        }
        // update aggregate product.stok
        const agg = await this.prisma.productWarehouseStock.aggregate({ _sum: { qty: true }, where: { productId } });
        const total = Number(agg._sum.qty ?? 0);
        await this.prisma.product.update({ where: { id: productId }, data: { stok: Math.round(total) } });
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
    async getStockMovements(query) {
        const { productId, type, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (productId)
            where.productId = productId;
        if (type)
            where.type = type;
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
    async getStockOpnames(query) {
        const { status, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status)
            where.status = status;
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
    async createStockOpname(dto) {
        return this.prisma.stockOpname.create({
            data: { date: dto.date, warehouseId: dto.warehouseId, note: dto.note, items: { create: dto.items } },
            include: { items: { include: { product: true } } },
        });
    }
    async validateStockOpname(id) {
        const opname = await this.prisma.stockOpname.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
        if (!opname)
            throw new NotFoundException('Stock opname tidak ditemukan');
        if (opname.status !== 'draft')
            throw new BadRequestException('Hanya opname draft yang dapat divalidasi');
        const summary = { matched: 0, more: 0, less: 0, details: [] };
        await this.prisma.$transaction(async (prisma) => {
            for (const item of opname.items) {
                const sys = Number(item.stokSistem ?? 0);
                const fisik = Number(item.stokFisik ?? 0);
                const selisih = fisik - sys;
                if (selisih === 0)
                    summary.matched++;
                else if (selisih > 0)
                    summary.more++;
                else
                    summary.less++;
                summary.details.push({ productId: item.productId, sys, fisik, selisih });
                if (selisih !== 0) {
                    if (opname.warehouseId) {
                        await prisma.productWarehouseStock.upsert({
                            where: { productId_warehouseId: { productId: item.productId, warehouseId: opname.warehouseId } },
                            create: { productId: item.productId, warehouseId: opname.warehouseId, qty: selisih },
                            update: { qty: { increment: selisih } },
                        });
                    }
                    else {
                        const product = await prisma.product.findUnique({ where: { id: item.productId } });
                        if (!product)
                            throw new NotFoundException('Produk tidak ditemukan');
                        await prisma.product.update({ where: { id: item.productId }, data: { stok: Math.round((product.stok ?? 0) + selisih) } });
                    }
                    await prisma.stockMovement.create({ data: { productId: item.productId, warehouseId: opname.warehouseId, type: selisih > 0 ? 'opname_in' : 'opname_out', qty: Math.round(Math.abs(selisih)), referenceId: id } });
                    const agg3 = await prisma.productWarehouseStock.aggregate({ _sum: { qty: true }, where: { productId: item.productId } });
                    const total3 = Number(agg3._sum.qty ?? 0);
                    await prisma.product.update({ where: { id: item.productId }, data: { stok: Math.round(total3) } });
                    const invAccount = await this.settings.get('inventory_account');
                    const otherAccount = await this.settings.get('other_income_account');
                    if (invAccount && otherAccount) {
                        const amount = Math.abs(selisih) * (Number(item.unitCost ?? 0) || 0);
                        const tanggal = new Date();
                        await this.journalSvc.createJournal({ tanggal, deskripsi: `Stock Opname: ${id}`, lines: [
                                { accountId: invAccount, debit: amount, kredit: 0 },
                                { accountId: otherAccount, debit: 0, kredit: amount },
                            ], referensi: id });
                    }
                }
            }
            await prisma.stockOpname.update({ where: { id }, data: { status: 'validated', updatedAt: new Date() } });
        });
        return { data: summary, message: 'Stock opname divalidasi' };
    }
    async exportStockOpname(id) {
        const opname = await this.prisma.stockOpname.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
        if (!opname)
            throw new NotFoundException('Stock opname tidak ditemukan');
        const { stockOpnameToExcelBuffer } = await import('./utils/excel.util.js');
        const buf = await stockOpnameToExcelBuffer(opname);
        return { filename: `stock-opname-${id}.xlsx`, content: buf.toString('base64') };
    }
    async importStockOpname(id, file) {
        const buf = typeof file === 'string' ? Buffer.from(file, 'base64') : Buffer.from(file);
        const { excelBufferToStockOpnameItems } = await import('./utils/excel.util.js');
        const rows = await excelBufferToStockOpnameItems(buf);
        const opname = await this.prisma.stockOpname.findUnique({ where: { id } });
        if (!opname)
            throw new NotFoundException('Stock opname tidak ditemukan');
        const itemsToCreate = [];
        for (const row of rows) {
            let productId = row.productId;
            if (!productId && row.sku) {
                const prod = await this.prisma.product.findFirst({ where: { sku: row.sku } });
                if (prod)
                    productId = prod.id;
            }
            if (!productId)
                continue;
            itemsToCreate.push({ productId, stokSistem: row.stokSistem ?? 0, stokFisik: row.stokFisik ?? 0, selisih: row.selisih ?? 0, note: row.note ?? '' });
        }
        const data = await this.prisma.stockOpname.update({ where: { id }, data: { items: { deleteMany: {}, create: itemsToCreate } }, include: { items: { include: { product: true } } } });
        return { data, message: 'Stock opname berhasil diimpor' };
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
    async getTransfers(query) {
        const { status, fromWarehouseId, toWarehouseId, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status)
            where.status = status;
        if (fromWarehouseId)
            where.fromWarehouseId = fromWarehouseId;
        if (toWarehouseId)
            where.toWarehouseId = toWarehouseId;
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
    async getTransfer(id) {
        const data = await this.prisma.stockTransfer.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
        if (!data)
            throw new NotFoundException('Transfer tidak ditemukan');
        return { data, message: 'success' };
    }
    async createTransfer(dto) {
        const fromWarehouse = dto.fromWarehouse ?? dto.fromWarehouseId;
        const toWarehouse = dto.toWarehouse ?? dto.toWarehouseId;
        if (!fromWarehouse || !toWarehouse)
            throw new BadRequestException('fromWarehouse dan toWarehouse harus diisi');
        const { items, ...rest } = dto;
        const count = await this.prisma.stockTransfer.count();
        const noTransfer = dto.noTransfer ?? `ST-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        const data = await this.prisma.stockTransfer.create({
            data: { ...rest, fromWarehouse, toWarehouse, noTransfer, status: 'draft', items: items?.length ? { create: items } : undefined },
            include: { items: true },
        });
        return { data, message: 'Transfer stok berhasil dibuat' };
    }
    async updateTransfer(id, dto) {
        const transfer = await this.prisma.stockTransfer.findUnique({ where: { id }, include: { items: true } });
        if (!transfer)
            throw new NotFoundException('Transfer tidak ditemukan');
        if (transfer.status !== 'draft')
            throw new BadRequestException('Hanya transfer draft dapat diubah');
        const fromWarehouse = dto.fromWarehouse ?? dto.fromWarehouseId ?? transfer.fromWarehouse;
        const toWarehouse = dto.toWarehouse ?? dto.toWarehouseId ?? transfer.toWarehouse;
        if (!fromWarehouse || !toWarehouse)
            throw new BadRequestException('fromWarehouse dan toWarehouse harus diisi');
        const { items, ...rest } = dto;
        const updateData = { ...rest, fromWarehouse, toWarehouse };
        if (items) {
            updateData.items = {
                deleteMany: {},
                create: items,
            };
        }
        const data = await this.prisma.stockTransfer.update({ where: { id }, data: updateData, include: { items: true } });
        return { data, message: 'Transfer stok berhasil diperbarui' };
    }
    async confirmTransfer(id) {
        const transfer = await this.prisma.stockTransfer.findUnique({ where: { id }, include: { items: true } });
        if (!transfer)
            throw new NotFoundException('Transfer tidak ditemukan');
        if (transfer.status !== 'draft')
            throw new BadRequestException('Hanya transfer draft yang dapat dikonfirmasi');
        await this.prisma.stockTransfer.update({ where: { id }, data: { status: 'confirmed', updatedAt: new Date() } });
        return { data: null, message: 'Transfer berhasil dikonfirmasi' };
    }
    async validateTransfer(id) {
        const transfer = await this.prisma.stockTransfer.findUnique({ where: { id }, include: { items: true } });
        if (!transfer)
            throw new NotFoundException('Transfer tidak ditemukan');
        if (transfer.status !== 'confirmed')
            throw new BadRequestException('Hanya transfer yang sudah dikonfirmasi dapat divalidasi');
        await this.prisma.$transaction(async (prisma) => {
            for (const item of transfer.items) {
                const qty = Math.round(Number(item.qty));
                const sourceStock = await prisma.productWarehouseStock.findUnique({ where: { productId_warehouseId: { productId: item.productId, warehouseId: transfer.fromWarehouse } } }).catch(() => null);
                if (!sourceStock || Number(sourceStock.qty) < qty) {
                    throw new BadRequestException(`Stok di gudang asal tidak mencukupi untuk produk ${item.productId}`);
                }
                await prisma.productWarehouseStock.update({ where: { productId_warehouseId: { productId: item.productId, warehouseId: transfer.fromWarehouse } }, data: { qty: { decrement: qty } } });
                await prisma.stockMovement.create({ data: { productId: item.productId, warehouseId: transfer.fromWarehouse, type: 'transfer_out', qty, referenceId: id } });
                const destinationKey = { productId: item.productId, warehouseId: transfer.toWarehouse };
                const destStock = await prisma.productWarehouseStock.findUnique({ where: { productId_warehouseId: destinationKey } }).catch(() => null);
                if (destStock) {
                    await prisma.productWarehouseStock.update({ where: { productId_warehouseId: destinationKey }, data: { qty: { increment: qty } } });
                }
                else {
                    await prisma.productWarehouseStock.create({ data: { productId: item.productId, warehouseId: transfer.toWarehouse, qty } });
                }
                await prisma.stockMovement.create({ data: { productId: item.productId, warehouseId: transfer.toWarehouse, type: 'transfer_in', qty, referenceId: id } });
                const agg = await prisma.productWarehouseStock.aggregate({ _sum: { qty: true }, where: { productId: item.productId } });
                const total = Number(agg._sum.qty ?? 0);
                await prisma.product.update({ where: { id: item.productId }, data: { stok: Math.round(total) } });
            }
            await prisma.stockTransfer.update({ where: { id }, data: { status: 'done', updatedAt: new Date() } });
        });
        return { data: null, message: 'Transfer tervalidasi dan stok dipindahkan' };
    }
    async cancelTransfer(id) {
        const t = await this.prisma.stockTransfer.findUnique({ where: { id } });
        if (!t)
            throw new NotFoundException('Transfer tidak ditemukan');
        if (t.status === 'done')
            throw new BadRequestException('Tidak bisa membatalkan transfer yang sudah selesai');
        await this.prisma.stockTransfer.update({ where: { id }, data: { status: 'cancelled', updatedAt: new Date() } });
        return { data: null, message: 'Transfer dibatalkan' };
    }
    async getAdjustments(query) {
        const { status, warehouseId, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status)
            where.status = status;
        if (warehouseId)
            where.warehouseId = warehouseId;
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
    async getAdjustment(id) {
        const data = await this.prisma.stockAdjustment.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
        if (!data)
            throw new NotFoundException('Penyesuaian stok tidak ditemukan');
        return { data, message: 'success' };
    }
    async createAdjustment(dto) {
        const { items, ...rest } = dto;
        const count = await this.prisma.stockAdjustment.count();
        const noAdjustment = dto.noAdjustment ?? `ADJ-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
        const data = await this.prisma.stockAdjustment.create({
            data: { ...rest, noAdjustment, status: 'draft', items: items?.length ? { create: items } : undefined },
            include: { items: true },
        });
        return { data, message: 'Penyesuaian stok berhasil dibuat' };
    }
    async validateAdjustment(id) {
        const adj = await this.prisma.stockAdjustment.findUnique({ where: { id }, include: { items: { include: { product: true } } } });
        if (!adj)
            throw new NotFoundException('Penyesuaian stok tidak ditemukan');
        if (adj.status !== 'draft')
            throw new BadRequestException('Hanya penyesuaian draft yang dapat divalidasi');
        await this.prisma.$transaction(async (prisma) => {
            for (const item of adj.items) {
                const qtySystem = Number(item.qtySystem ?? 0);
                const qtyActual = Number(item.qtyActual ?? 0);
                const selisih = Number(item.qtyDiff ?? qtyActual - qtySystem);
                if (selisih !== 0) {
                    if (adj.warehouseId) {
                        await prisma.productWarehouseStock.upsert({
                            where: { productId_warehouseId: { productId: item.productId, warehouseId: adj.warehouseId } },
                            create: { productId: item.productId, warehouseId: adj.warehouseId, qty: selisih },
                            update: { qty: { increment: selisih } },
                        });
                    }
                    else {
                        const product = await prisma.product.findUnique({ where: { id: item.productId } });
                        if (!product)
                            throw new NotFoundException('Produk tidak ditemukan');
                        await prisma.product.update({ where: { id: item.productId }, data: { stok: Math.round((product.stok ?? 0) + selisih) } });
                    }
                    await prisma.stockMovement.create({ data: { productId: item.productId, warehouseId: adj.warehouseId, type: selisih > 0 ? 'adjustment_in' : 'adjustment_out', qty: Math.round(Math.abs(selisih)), referenceId: id } });
                    const agg2 = await prisma.productWarehouseStock.aggregate({ _sum: { qty: true }, where: { productId: item.productId } });
                    const total2 = Number(agg2._sum.qty ?? 0);
                    await prisma.product.update({ where: { id: item.productId }, data: { stok: Math.round(total2) } });
                    const invAccount = await this.settings.get('inventory_account');
                    const otherAccount = await this.settings.get('other_income_account');
                    if (invAccount && otherAccount) {
                        const tanggal = new Date();
                        const amount = Math.abs(selisih) * (Number(item.unitCost ?? 0) || 0);
                        await this.journalSvc.createJournal({ tanggal, deskripsi: `Penyesuaian stok ${adj.noAdjust ?? adj.id}`, lines: [
                                { accountId: invAccount, debit: amount, kredit: 0, deskripsi: selisih > 0 ? 'Persediaan bertambah' : 'Selisih persediaan' },
                                { accountId: otherAccount, debit: 0, kredit: amount, deskripsi: selisih > 0 ? 'Pendapatan lain-lain' : 'Persediaan berkurang' },
                            ], referensi: id });
                    }
                }
            }
            await prisma.stockAdjustment.update({ where: { id }, data: { status: 'validated' } });
        });
        return { data: null, message: 'Penyesuaian stok berhasil divalidasi' };
    }
    async getReorderRules(query) {
        const { productId, active } = query;
        const where = {};
        if (productId)
            where.productId = productId;
        if (active !== undefined)
            where.active = active === 'true' || active === true;
        const data = await this.prisma.reorderRule.findMany({
            where,
            include: { product: { select: { id: true, name: true, stok: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return { data, message: 'success' };
    }
    async createReorderRule(dto) {
        if (!dto.productId)
            throw new BadRequestException('productId harus diisi');
        const data = await this.prisma.reorderRule.create({ data: dto });
        return { data, message: 'Reorder rule berhasil dibuat' };
    }
    async updateReorderRule(id, dto) {
        const data = await this.prisma.reorderRule.update({ where: { id }, data: dto });
        return { data, message: 'Reorder rule berhasil diupdate' };
    }
    async deleteReorderRule(id) {
        await this.prisma.reorderRule.delete({ where: { id } });
        return { data: null, message: 'Reorder rule berhasil dihapus' };
    }
    // ----------------- Reports -----------------
    async getStockCurrent(query) {
        const { warehouseId, categoryId } = query;
        const where = { active: true };
        if (warehouseId)
            where.warehouseId = warehouseId;
        if (categoryId)
            where.categoryId = categoryId;
        const products = await this.prisma.product.findMany({ where, include: { warehouse: true, category: true } });
        return { data: products };
    }
    async getStockMovementReport(query) {
        const { startDate, endDate, productId, warehouseId } = query;
        const where = {};
        if (startDate)
            where.createdAt = { gte: new Date(startDate) };
        if (endDate)
            where.createdAt = { ...(where.createdAt ?? {}), lte: new Date(endDate) };
        if (productId)
            where.productId = productId;
        if (warehouseId)
            where.warehouseId = warehouseId;
        const data = await this.prisma.stockMovement.findMany({ where, orderBy: { createdAt: 'desc' } });
        return { data };
    }
    async getStockAging(query) {
        const { warehouseId, asOf } = query;
        // basic aging from StockValuation
        const asOfDate = asOf ? new Date(asOf) : new Date();
        const where = {};
        if (warehouseId)
            where.warehouseId = warehouseId;
        const data = await this.prisma.stockValuation.findMany({ where, orderBy: { date: 'asc' } });
        return { data, asOf: asOfDate };
    }
    async getStockValuationReport(query) {
        const { asOf, method } = query;
        const date = asOf ? new Date(asOf) : new Date();
        // simplified: return latest stockValuations up to date
        const data = await this.prisma.stockValuation.findMany({ where: { date: { lte: date } }, orderBy: { date: 'desc' } });
        return { data, method: method ?? 'average' };
    }
    async getProductPerformance(query) {
        const { startDate, endDate } = query;
        // simplified: aggregate sales by product
        const where = {};
        if (startDate)
            where.tanggal = { gte: new Date(startDate) };
        if (endDate)
            where.tanggal = { ...(where.tanggal ?? {}), lte: new Date(endDate) };
        const sales = await this.prisma.sale.findMany({ where, include: { items: true } });
        const map = {};
        for (const s of sales) {
            for (const it of s.items) {
                const pid = it.productId ?? it.productId;
                map[pid] = map[pid] ?? { productId: pid, qty: 0, revenue: 0 };
                map[pid].qty += Number(it.qty ?? 0);
                map[pid].revenue += Number(it.subtotal ?? 0);
            }
        }
        return { data: Object.values(map) };
    }
};
InventoryService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __param(1, Inject(SettingsService)),
    __param(2, Inject(JournalService)),
    __metadata("design:paramtypes", [PrismaService,
        SettingsService,
        JournalService])
], InventoryService);
export { InventoryService };
