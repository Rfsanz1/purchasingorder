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
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let RecruitmentService = class RecruitmentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPositions(query) {
        const { status, search } = query;
        const where = {};
        if (status)
            where.status = status;
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        return this.prisma.jobPosition.findMany({ where, include: { _count: { select: { applications: true } } }, orderBy: { createdAt: 'desc' } });
    }
    async createPosition(dto) { return this.prisma.jobPosition.create({ data: dto }); }
    async updatePosition(id, dto) { return this.prisma.jobPosition.update({ where: { id }, data: dto }); }
    async getApplications(query) {
        const { jobId, stage, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (jobId)
            where.jobId = jobId;
        if (stage)
            where.stage = stage;
        const [data, total] = await Promise.all([
            this.prisma.jobApplication.findMany({ where, skip, take: Number(limit), include: { job: true }, orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }] }),
            this.prisma.jobApplication.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getApplication(id) {
        const app = await this.prisma.jobApplication.findUnique({ where: { id }, include: { job: true } });
        if (!app)
            throw new NotFoundException('Lamaran tidak ditemukan');
        return app;
    }
    async createApplication(dto) { return this.prisma.jobApplication.create({ data: dto, include: { job: true } }); }
    async updateApplication(id, dto) { return this.prisma.jobApplication.update({ where: { id }, data: dto, include: { job: true } }); }
    async advanceStage(id, stage) { return this.prisma.jobApplication.update({ where: { id }, data: { stage } }); }
    async refuseApplication(id, reason) { return this.prisma.jobApplication.update({ where: { id }, data: { stage: 'refused', refuseReason: reason } }); }
    async getStats() {
        const [totalPositions, openPositions, totalApps] = await Promise.all([
            this.prisma.jobPosition.count(),
            this.prisma.jobPosition.count({ where: { status: 'open' } }),
            this.prisma.jobApplication.count(),
        ]);
        const stageCount = await this.prisma.jobApplication.groupBy({ by: ['stage'], _count: true });
        return { totalPositions, openPositions, totalApps, stageCount };
    }
};
RecruitmentService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], RecruitmentService);
export { RecruitmentService };
