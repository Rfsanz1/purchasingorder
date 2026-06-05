var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let CreditLimitService = class CreditLimitService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCreditLimits(query) {
        const { search, page = 1, limit = 50 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { active: true };
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        const [data, total] = await Promise.all([
            this.prisma.customer.findMany({ where, skip, take: Number(limit), orderBy: { name: 'asc' } }),
            this.prisma.customer.count({ where }),
        ]);
        const enriched = data.map(c => {
            const available = Number(c.creditLimit) > 0 ? Number(c.creditLimit) - Number(c.creditUsed) : null;
            const pctUsed = Number(c.creditLimit) > 0 ? (Number(c.creditUsed) / Number(c.creditLimit)) * 100 : 0;
            return { ...c, available, pctUsed, isExceeded: available !== null && available < 0, isWarning: pctUsed >= 80 };
        });
        return { data: enriched, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async checkCreditLimit(customerId, newOrderAmount) {
        const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer)
            throw new NotFoundException('Pelanggan tidak ditemukan');
        const creditUsed = await this.recalcCreditUsed(customerId);
        const total = creditUsed + newOrderAmount;
        const limit = Number(customer.creditLimit);
        return {
            customerId, customerName: customer.name,
            creditLimit: limit, used: creditUsed,
            newOrderAmount, projectedTotal: total,
            available: limit > 0 ? limit - total : null,
            isExceeded: limit > 0 && total > limit,
            warningAt80Pct: limit > 0 && total > limit * 0.8,
        };
    }
    async updateCreditUsed(customerId) {
        const creditUsed = await this.recalcCreditUsed(customerId);
        return this.prisma.customer.update({
            where: { id: customerId }, data: { creditUsed },
        });
    }
    async setCreditLimit(customerId, creditLimit) {
        return this.prisma.customer.update({
            where: { id: customerId }, data: { creditLimit },
        });
    }
    async setBulkCreditLimit(items) {
        const results = await Promise.all(items.map(({ customerId, creditLimit }) => this.prisma.customer.update({ where: { id: customerId }, data: { creditLimit } })));
        return { updated: results.length };
    }
    async recalcCreditUsed(customerId) {
        const outstanding = await this.prisma.sale.aggregate({
            where: { customerId, status: { notIn: ['paid', 'lunas', 'cancelled', 'batal'] } },
            _sum: { grandTotal: true },
        });
        return Number(outstanding._sum.grandTotal ?? 0);
    }
};
CreditLimitService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CreditLimitService);
export { CreditLimitService };
