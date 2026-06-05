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
let CrmService = class CrmService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLeads(query) {
        const { search, stage, type, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { active: true };
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (stage)
            where.stage = stage;
        if (type)
            where.type = type;
        const [data, total] = await Promise.all([
            this.prisma.lead.findMany({ where, skip, take: Number(limit), include: { team: true, activities: { where: { status: 'planned' }, take: 1 } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.lead.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getLead(id) {
        const lead = await this.prisma.lead.findUnique({ where: { id }, include: { team: true, activities: { orderBy: { dueDate: 'asc' } } } });
        if (!lead)
            throw new NotFoundException('Lead tidak ditemukan');
        return lead;
    }
    async createLead(dto) { return this.prisma.lead.create({ data: dto }); }
    async updateLead(id, dto) { return this.prisma.lead.update({ where: { id }, data: dto }); }
    async deleteLead(id) { return this.prisma.lead.update({ where: { id }, data: { active: false } }); }
    async convertToOpportunity(id) {
        return this.prisma.lead.update({ where: { id }, data: { type: 'opportunity', stage: 'qualified' } });
    }
    async markAsWon(id) {
        return this.prisma.lead.update({ where: { id }, data: { stage: 'won', closingDate: new Date(), probability: 100 } });
    }
    async markAsLost(id, reason) {
        return this.prisma.lead.update({ where: { id }, data: { stage: 'lost', lostReason: reason, closingDate: new Date(), probability: 0 } });
    }
    async getPipeline(query) {
        const { teamId } = query;
        const where = { active: true, type: 'opportunity' };
        if (teamId)
            where.teamId = teamId;
        const stages = ['new', 'qualified', 'proposition', 'won', 'lost'];
        const pipeline = await Promise.all(stages.map(async (stage) => {
            const leads = await this.prisma.lead.findMany({ where: { ...where, stage }, orderBy: { priority: 'desc' } });
            const total = leads.reduce((s, l) => s + Number(l.expectedRevenue), 0);
            return { stage, leads, total };
        }));
        return pipeline;
    }
    async getSalesTeams() { return this.prisma.salesTeam.findMany({ where: { active: true } }); }
    async createSalesTeam(dto) { return this.prisma.salesTeam.create({ data: dto }); }
    async getActivities(query) {
        const { status, leadId } = query;
        const where = {};
        if (status)
            where.status = status;
        if (leadId)
            where.leadId = leadId;
        return this.prisma.crmActivity.findMany({ where, include: { lead: true }, orderBy: { dueDate: 'asc' } });
    }
    async scheduleActivity(dto) { return this.prisma.crmActivity.create({ data: dto }); }
    async markActivityDone(id) {
        return this.prisma.crmActivity.update({ where: { id }, data: { status: 'done', doneDate: new Date() } });
    }
    async getWinLossReport(query) {
        const { from, to } = query;
        const where = { stage: { in: ['won', 'lost'] } };
        if (from)
            where.closingDate = { gte: new Date(from) };
        if (to)
            where.closingDate = { ...where.closingDate, lte: new Date(to) };
        const [won, lost] = await Promise.all([
            this.prisma.lead.aggregate({ where: { ...where, stage: 'won' }, _count: true, _sum: { expectedRevenue: true } }),
            this.prisma.lead.aggregate({ where: { ...where, stage: 'lost' }, _count: true }),
        ]);
        return { won: { count: won._count, revenue: won._sum.expectedRevenue ?? 0 }, lost: { count: lost._count } };
    }
    async getLostReasons() { return this.prisma.lostReason.findMany({ where: { active: true } }); }
    async getStats() {
        const [total, opportunities, won, lost] = await Promise.all([
            this.prisma.lead.count({ where: { active: true } }),
            this.prisma.lead.count({ where: { active: true, type: 'opportunity' } }),
            this.prisma.lead.count({ where: { stage: 'won' } }),
            this.prisma.lead.count({ where: { stage: 'lost' } }),
        ]);
        const pipeline = await this.prisma.lead.aggregate({ where: { active: true, type: 'opportunity' }, _sum: { expectedRevenue: true } });
        return { total, opportunities, won, lost, pipelineValue: pipeline._sum.expectedRevenue ?? 0 };
    }
};
CrmService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], CrmService);
export { CrmService };
