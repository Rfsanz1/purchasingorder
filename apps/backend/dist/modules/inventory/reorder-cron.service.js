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
var ReorderCronService_1;
import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service.js';
let ReorderCronService = ReorderCronService_1 = class ReorderCronService {
    prisma;
    logger = new Logger(ReorderCronService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleReorder() {
        this.logger.log('Running daily reorder check');
        const rules = await this.prisma.reorderRule.findMany({ where: { active: true }, include: { product: true } });
        for (const rule of rules) {
            try {
                // compute product stock per warehouse if warehouseId present
                let qty = 0;
                if (rule.warehouseId) {
                    const ws = await this.prisma.productWarehouseStock.findUnique({ where: { productId_warehouseId: { productId: rule.productId, warehouseId: rule.warehouseId } } });
                    qty = Number(ws?.qty ?? 0);
                }
                else {
                    const ag = await this.prisma.product.aggregate({ _sum: { stok: true }, where: { id: rule.productId } });
                    qty = Number(ag._sum.stok ?? 0);
                }
                if (qty <= Number(rule.minQty ?? 0)) {
                    const message = `Stok ${rule.product?.name ?? rule.productId} di ${rule.warehouseId ?? 'semua gudang'} tinggal ${qty}, perlu reorder ${rule.reorderQty}`;
                    await this.prisma.notification.create({ data: { recipient: 'stock-team', title: 'Reorder Needed', message } });
                }
            }
            catch (err) {
                this.logger.error('Error checking reorder rule', err);
            }
        }
    }
};
__decorate([
    Cron(CronExpression.EVERY_DAY_AT_1AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReorderCronService.prototype, "handleReorder", null);
ReorderCronService = ReorderCronService_1 = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], ReorderCronService);
export { ReorderCronService };
