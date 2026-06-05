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
let LeaveService = class LeaveService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLeaveTypes() { return this.prisma.leaveType.findMany({ where: { active: true } }); }
    async createLeaveType(dto) { return this.prisma.leaveType.create({ data: dto }); }
    async getAllocations(query) {
        const { employeeId, year } = query;
        const where = {};
        if (employeeId)
            where.employeeId = employeeId;
        if (year)
            where.year = Number(year);
        return this.prisma.leaveAllocation.findMany({ where, include: { employee: true, leaveType: true }, orderBy: { createdAt: 'desc' } });
    }
    async createAllocation(dto) { return this.prisma.leaveAllocation.create({ data: dto, include: { leaveType: true, employee: true } }); }
    async getRequests(query) {
        const { employeeId, status, leaveTypeId, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (employeeId)
            where.employeeId = employeeId;
        if (status)
            where.status = status;
        if (leaveTypeId)
            where.leaveTypeId = leaveTypeId;
        const [data, total] = await Promise.all([
            this.prisma.leaveRequest.findMany({ where, skip, take: Number(limit), include: { employee: true, leaveType: true }, orderBy: { createdAt: 'desc' } }),
            this.prisma.leaveRequest.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async createRequest(dto) { return this.prisma.leaveRequest.create({ data: dto, include: { leaveType: true, employee: true } }); }
    async approveRequest(id, approvedBy) {
        return this.prisma.leaveRequest.update({ where: { id }, data: { status: 'validated', approvedBy, approvedAt: new Date() } });
    }
    async refuseRequest(id) {
        return this.prisma.leaveRequest.update({ where: { id }, data: { status: 'refused' } });
    }
    async getLeaveBalance(employeeId, year) {
        const allocations = await this.prisma.leaveAllocation.findMany({ where: { employeeId, year }, include: { leaveType: true } });
        const taken = await this.prisma.leaveRequest.groupBy({
            by: ['leaveTypeId'],
            where: { employeeId, status: 'validated', dateFrom: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) } },
            _sum: { numberOfDays: true },
        });
        return allocations.map(a => ({
            leaveType: a.leaveType.name,
            allocated: Number(a.numberOfDays),
            taken: Number(taken.find(t => t.leaveTypeId === a.leaveTypeId)?._sum.numberOfDays ?? 0),
            remaining: Number(a.numberOfDays) - Number(taken.find(t => t.leaveTypeId === a.leaveTypeId)?._sum.numberOfDays ?? 0),
        }));
    }
    async getStats() {
        const [total, pending, approved] = await Promise.all([
            this.prisma.leaveRequest.count(),
            this.prisma.leaveRequest.count({ where: { status: { in: ['draft', 'confirmed'] } } }),
            this.prisma.leaveRequest.count({ where: { status: 'validated' } }),
        ]);
        return { total, pending, approved };
    }
};
LeaveService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], LeaveService);
export { LeaveService };
