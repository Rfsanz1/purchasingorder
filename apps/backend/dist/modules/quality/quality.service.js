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
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let QualityService = class QualityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQcps(query) {
        const { operation, active } = query;
        const where = {};
        if (operation)
            where.operation = operation;
        if (active !== undefined)
            where.active = active === 'true';
        return this.prisma.qualityControlPoint.findMany({ where, include: { _count: { select: { checks: true } } }, orderBy: { createdAt: 'desc' } });
    }
    async createQcp(dto) { return this.prisma.qualityControlPoint.create({ data: dto }); }
    async updateQcp(id, dto) { return this.prisma.qualityControlPoint.update({ where: { id }, data: dto }); }
    async getChecks(query) {
        const { qcpId, status, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (qcpId)
            where.qcpId = qcpId;
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.qualityCheck.findMany({ where, skip, take: Number(limit), include: { qcp: true }, orderBy: { createdAt: 'desc' } }),
            this.prisma.qualityCheck.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async createCheck(dto) { return this.prisma.qualityCheck.create({ data: dto, include: { qcp: true } }); }
    async passCheck(id, measuredValue) { return this.prisma.qualityCheck.update({ where: { id }, data: { status: 'pass', measuredValue, doneAt: new Date() } }); }
    async failCheck(id, notes) { return this.prisma.qualityCheck.update({ where: { id }, data: { status: 'fail', notes, doneAt: new Date() } }); }
    async getAlerts(query) {
        const { stage, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (stage)
            where.stage = stage;
        const [data, total] = await Promise.all([
            this.prisma.qualityAlert.findMany({ where, skip, take: Number(limit), orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }] }),
            this.prisma.qualityAlert.count({ where }),
        ]);
        return { data, total };
    }
    async createAlert(dto) { return this.prisma.qualityAlert.create({ data: dto }); }
    async updateAlert(id, dto) { return this.prisma.qualityAlert.update({ where: { id }, data: dto }); }
    async getStats() {
        const [totalChecks, passed, failed, pending, totalAlerts] = await Promise.all([
            this.prisma.qualityCheck.count(),
            this.prisma.qualityCheck.count({ where: { status: 'pass' } }),
            this.prisma.qualityCheck.count({ where: { status: 'fail' } }),
            this.prisma.qualityCheck.count({ where: { status: 'todo' } }),
            this.prisma.qualityAlert.count({ where: { stage: { notIn: ['closed'] } } }),
        ]);
        return { totalChecks, passed, failed, pending, totalAlerts };
    }
};
QualityService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], QualityService);
export { QualityService };
