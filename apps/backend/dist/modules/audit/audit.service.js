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
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAuditLog(filter) {
        const { tableName, recordId, actorId, action, dateFrom, dateTo, branchId, page = 1, limit = 50 } = filter;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (tableName)
            where.tableName = { contains: tableName, mode: 'insensitive' };
        if (recordId)
            where.recordId = recordId;
        if (actorId)
            where.actorId = actorId;
        if (action)
            where.action = { contains: action, mode: 'insensitive' };
        if (branchId)
            where.branchId = branchId;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo + 'T23:59:59');
        }
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where, skip, take: Number(limit),
                include: { actor: { select: { id: true, name: true, email: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getRecordHistory(tableName, recordId) {
        const logs = await this.prisma.auditLog.findMany({
            where: { tableName, recordId },
            include: { actor: { select: { id: true, name: true, email: true } } },
            orderBy: { createdAt: 'asc' },
        });
        return logs.map((log, idx) => ({
            ...log,
            version: idx + 1,
            diff: this.computeDiff(log.oldData, log.newData),
        }));
    }
    async logActivity(data) {
        return this.prisma.auditLog.create({ data });
    }
    computeDiff(oldData, newData) {
        if (!oldData || !newData)
            return null;
        const changes = {};
        const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
        for (const key of keys) {
            if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
                changes[key] = { from: oldData[key], to: newData[key] };
            }
        }
        return Object.keys(changes).length > 0 ? changes : null;
    }
};
AuditService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AuditService);
export { AuditService };
