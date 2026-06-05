var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let CostingService = class CostingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ─── FIFO: ambil lot terlama dulu ─────────────────────────────────────────
    async calculateFIFO(productId, qtyKeluar) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new NotFoundException('Produk tidak ditemukan');
        const lots = await this.prisma.stockLot.findMany({
            where: { productId, qtySisa: { gt: 0 } },
            orderBy: { createdAt: 'asc' },
        });
        let remaining = qtyKeluar;
        let totalCOGS = 0;
        const lotsConsumed = [];
        for (const lot of lots) {
            if (remaining <= 0)
                break;
            const takeQty = Math.min(remaining, Number(lot.qtySisa));
            const amount = takeQty * Number(lot.unitCost);
            lotsConsumed.push({ nomorLot: lot.nomorLot, qty: takeQty, unitCost: Number(lot.unitCost), amount });
            totalCOGS += amount;
            remaining -= takeQty;
        }
        if (remaining > 0) {
            throw new BadRequestException(`Stok lot tidak cukup. Kurang ${remaining} unit dari total ${qtyKeluar} yang diminta.`);
        }
        return {
            totalCOGS,
            avgUnitCost: totalCOGS / qtyKeluar,
            lotsConsumed,
            remainingQty: 0,
        };
    }
    // ─── FIFO: commit (benar-benar kurangi qtySisa lot) ───────────────────────
    async commitFIFO(productId, qtyKeluar, referenceId) {
        const result = await this.calculateFIFO(productId, qtyKeluar);
        for (const item of result.lotsConsumed) {
            await this.prisma.stockLot.updateMany({
                where: { productId, nomorLot: item.nomorLot },
                data: { qtySisa: { decrement: item.qty } },
            });
        }
        await this.createValuationEntry(productId, -qtyKeluar, result.avgUnitCost, 'OUT', referenceId);
        await this.createAutoJournal('DELIVERY', productId, qtyKeluar, result.avgUnitCost, referenceId);
        return result;
    }
    // ─── AVERAGE COST: moving average saat barang masuk ───────────────────────
    async calculateAverageCost(productId, qtyMasuk, unitCost) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new NotFoundException('Produk tidak ditemukan');
        const currentQty = product.stok;
        const currentAvg = Number(product.currentAvgCost);
        const currentValue = currentQty * currentAvg;
        const incomingValue = qtyMasuk * unitCost;
        const newQty = currentQty + qtyMasuk;
        const newAvg = newQty > 0 ? (currentValue + incomingValue) / newQty : unitCost;
        await this.prisma.product.update({
            where: { id: productId },
            data: { currentAvgCost: newAvg },
        });
        return { previousAvgCost: currentAvg, newAvgCost: newAvg, newQty };
    }
    // ─── REVALUASI STOK ───────────────────────────────────────────────────────
    async revaluateStock(productId, newCost, note) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new NotFoundException('Produk tidak ditemukan');
        const oldCost = Number(product.currentAvgCost);
        const qty = product.stok;
        const adjustmentValue = qty * (newCost - oldCost);
        await this.prisma.product.update({
            where: { id: productId },
            data: { currentAvgCost: newCost, standardCost: newCost },
        });
        await this.createValuationEntry(productId, 0, newCost, 'REVALUATION');
        await this.createRevaluationJournal(productId, qty, oldCost, newCost, note);
        return {
            productId,
            oldCost,
            newCost,
            qty,
            adjustmentValue,
            message: adjustmentValue >= 0
                ? `Persediaan naik Rp ${Math.abs(adjustmentValue).toLocaleString('id-ID')}`
                : `Persediaan turun Rp ${Math.abs(adjustmentValue).toLocaleString('id-ID')}`,
        };
    }
    // ─── BUAT LOT BARU ────────────────────────────────────────────────────────
    async createLot(data) {
        return this.prisma.stockLot.create({
            data: {
                productId: data.productId,
                nomorLot: data.nomorLot,
                qtyAwal: data.qtyAwal,
                qtySisa: data.qtyAwal,
                unitCost: data.unitCost,
                expiryDate: data.expiryDate,
                referenceId: data.referenceId,
            },
        });
    }
    // ─── CATAT VALUATION ENTRY ────────────────────────────────────────────────
    async createValuationEntry(productId, qty, unitCost, movementType, referenceId) {
        return this.prisma.stockValuation.create({
            data: {
                productId,
                date: new Date(),
                qty,
                unitCost,
                totalValue: qty * unitCost,
                movementType,
                referenceId,
            },
        });
    }
    // ─── AUTO-JOURNAL: BARANG MASUK (GRN) ────────────────────────────────────
    async createAutoJournal(type, productId, qty, unitCost, referenceId) {
        const amount = qty * unitCost;
        if (amount === 0)
            return null;
        const now = new Date();
        const nomor = `AUTO-${type}-${Date.now()}`;
        const accounts = await this.getAccountCodes();
        let lines = [];
        let deskripsi = '';
        switch (type) {
            case 'GRN':
                deskripsi = `Penerimaan Barang GRN - ${referenceId ?? ''}`;
                lines = [
                    { accountId: accounts.persediaan, debit: amount, kredit: 0, deskripsi: 'Persediaan Barang' },
                    { accountId: accounts.grirClearing, debit: 0, kredit: amount, deskripsi: 'GR/IR Clearing' },
                ];
                break;
            case 'DELIVERY':
                deskripsi = `Pengiriman Barang - ${referenceId ?? ''}`;
                lines = [
                    { accountId: accounts.hpp, debit: amount, kredit: 0, deskripsi: 'HPP / Beban Pokok' },
                    { accountId: accounts.persediaan, debit: 0, kredit: amount, deskripsi: 'Persediaan Barang' },
                ];
                break;
            case 'OPNAME_PLUS':
                deskripsi = `Selisih Stock Opname (+) - ${referenceId ?? ''}`;
                lines = [
                    { accountId: accounts.persediaan, debit: amount, kredit: 0, deskripsi: 'Persediaan Barang' },
                    { accountId: accounts.selisihStok, debit: 0, kredit: amount, deskripsi: 'Selisih Stok Opname' },
                ];
                break;
            case 'OPNAME_MINUS':
                deskripsi = `Selisih Stock Opname (-) - ${referenceId ?? ''}`;
                lines = [
                    { accountId: accounts.selisihStok, debit: amount, kredit: 0, deskripsi: 'Selisih Stok Opname' },
                    { accountId: accounts.persediaan, debit: 0, kredit: amount, deskripsi: 'Persediaan Barang' },
                ];
                break;
            case 'LANDED_COST':
                deskripsi = `Landed Cost - ${referenceId ?? ''}`;
                lines = [
                    { accountId: accounts.persediaan, debit: amount, kredit: 0, deskripsi: 'Landed Cost → Persediaan' },
                    { accountId: accounts.hutangDagang, debit: 0, kredit: amount, deskripsi: 'Hutang / Kas' },
                ];
                break;
            case 'REVALUATION':
                deskripsi = `Revaluasi Stok - Produk ${productId}`;
                lines = [
                    { accountId: amount >= 0 ? accounts.persediaan : accounts.revaluasi, debit: Math.abs(amount), kredit: 0, deskripsi: 'Revaluasi Persediaan' },
                    { accountId: amount >= 0 ? accounts.revaluasi : accounts.persediaan, debit: 0, kredit: Math.abs(amount), deskripsi: 'Revaluasi Persediaan' },
                ];
                break;
        }
        if (!lines[0]?.accountId)
            return null;
        try {
            return await this.prisma.journal.create({
                data: {
                    nomor,
                    tanggal: now,
                    referensi: referenceId,
                    deskripsi,
                    status: 'POSTED',
                    lines: {
                        create: lines.map((l) => ({
                            accountId: l.accountId,
                            debit: l.debit,
                            kredit: l.kredit,
                            deskripsi: l.deskripsi,
                        })),
                    },
                },
            });
        }
        catch {
            return null;
        }
    }
    async createRevaluationJournal(productId, qty, oldCost, newCost, note) {
        const amount = qty * Math.abs(newCost - oldCost);
        const isIncrease = newCost > oldCost;
        return this.createAutoJournal('REVALUATION', productId, isIncrease ? qty : -qty, Math.abs(newCost - oldCost), note);
    }
    async getAccountCodes() {
        const find = async (code) => {
            const acc = await this.prisma.account.findFirst({ where: { code } });
            return acc?.id ?? '';
        };
        const [persediaan, grirClearing, hpp, selisihStok, hutangDagang, revaluasi] = await Promise.all([
            find('1140'), find('1150'), find('5100'), find('5210'), find('2110'), find('5220'),
        ]);
        return { persediaan, grirClearing, hpp, selisihStok, hutangDagang, revaluasi };
    }
};
CostingService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CostingService);
export { CostingService };
