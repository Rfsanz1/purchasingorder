var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let ValuationService = class ValuationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ─── STOCK VALUATION: nilai total persediaan per tanggal ──────────────────
    async getStockValuation(date, warehouseId) {
        const asOf = date ?? new Date();
        const where = { active: true, stok: { gt: 0 } };
        if (warehouseId)
            where.warehouseId = warehouseId;
        const products = await this.prisma.product.findMany({
            where,
            include: { category: true, warehouse: true },
            orderBy: { name: 'asc' },
        });
        const rows = products.map((p) => {
            const unitCost = Number(p.currentAvgCost) || Number(p.hargaBeli) || 0;
            const totalValue = p.stok * unitCost;
            return {
                productId: p.id,
                sku: p.sku,
                name: p.name,
                warehouse: p.warehouse?.name,
                category: p.category?.name,
                stok: p.stok,
                unitCost,
                totalValue,
                costingMethod: p.costingMethod,
            };
        });
        const totalValue = rows.reduce((s, r) => s + r.totalValue, 0);
        return { asOf, totalValue, rows };
    }
    // ─── STOCK AGING: umur stok per produk per lot ────────────────────────────
    async getStockAgingReport(warehouseId) {
        const lots = await this.prisma.stockLot.findMany({
            where: { qtySisa: { gt: 0 } },
            include: { product: { include: { warehouse: true } } },
            orderBy: { createdAt: 'asc' },
        });
        const now = new Date();
        return lots
            .filter((lot) => !warehouseId || lot.product?.warehouseId === warehouseId)
            .map((lot) => {
            const ageDays = Math.floor((now.getTime() - lot.createdAt.getTime()) / 86_400_000);
            const expiryDate = lot.expiryDate ?? undefined;
            const expiredIn = expiryDate
                ? Math.floor((expiryDate.getTime() - now.getTime()) / 86_400_000)
                : undefined;
            let ageCategory = 'fresh';
            if (ageDays > 180)
                ageCategory = 'critical';
            else if (ageDays > 90)
                ageCategory = 'slow';
            else if (ageDays > 30)
                ageCategory = 'normal';
            if (expiredIn !== undefined && expiredIn <= 30)
                ageCategory = 'critical';
            else if (expiredIn !== undefined && expiredIn <= 90)
                ageCategory = 'slow';
            return {
                productId: lot.productId,
                sku: lot.product.sku,
                name: lot.product.name,
                nomorLot: lot.nomorLot,
                qtyAwal: Number(lot.qtyAwal),
                qtySisa: Number(lot.qtySisa),
                unitCost: Number(lot.unitCost),
                totalValue: Number(lot.qtySisa) * Number(lot.unitCost),
                ageDays,
                expiryDate,
                expiredIn,
                ageCategory,
            };
        });
    }
    // ─── SLOW MOVING: produk tidak bergerak > X hari ─────────────────────────
    async getSlowMovingItems(days = 90, warehouseId) {
        const cutoff = new Date(Date.now() - days * 86_400_000);
        const allProducts = await this.prisma.product.findMany({
            where: {
                active: true,
                stok: { gt: 0 },
                ...(warehouseId ? { warehouseId } : {}),
            },
            include: {
                warehouse: true,
                category: true,
                stockMovements: {
                    where: { createdAt: { gte: cutoff } },
                    take: 1,
                },
            },
        });
        const slowMovers = allProducts.filter((p) => p.stockMovements.length === 0);
        return slowMovers.map((p) => ({
            productId: p.id,
            sku: p.sku,
            name: p.name,
            category: p.category?.name,
            warehouse: p.warehouse?.name,
            stok: p.stok,
            unitCost: Number(p.currentAvgCost) || Number(p.hargaBeli),
            totalValue: p.stok * (Number(p.currentAvgCost) || Number(p.hargaBeli)),
            daysSinceMovement: days,
            costingMethod: p.costingMethod,
        }));
    }
    // ─── STOCK LOT LIST ───────────────────────────────────────────────────────
    async getStockLots(query) {
        const { productId, page = 1, limit = 50 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (productId)
            where.productId = productId;
        const [data, total] = await Promise.all([
            this.prisma.stockLot.findMany({
                where, skip, take: Number(limit),
                include: { product: { include: { warehouse: true, category: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.stockLot.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    // ─── VALUATION HISTORY ────────────────────────────────────────────────────
    async getValuationHistory(productId) {
        return this.prisma.stockValuation.findMany({
            where: { productId },
            include: { product: true },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    // ─── SUMMARY STATS ────────────────────────────────────────────────────────
    async getValuationStats(warehouseId) {
        const valuation = await this.getStockValuation(undefined, warehouseId);
        const aging = await this.getStockAgingReport(warehouseId);
        const criticalLots = aging.filter((a) => a.ageCategory === 'critical').length;
        const slowLots = aging.filter((a) => a.ageCategory === 'slow').length;
        const totalLots = aging.length;
        return {
            totalInventoryValue: valuation.totalValue,
            totalProducts: valuation.rows.length,
            criticalLots,
            slowLots,
            totalLots,
            asOf: valuation.asOf,
        };
    }
};
ValuationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ValuationService);
export { ValuationService };
