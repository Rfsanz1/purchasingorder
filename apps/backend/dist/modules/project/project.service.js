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
let ProjectService = class ProjectService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProjects(query) {
        const { search, status, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { active: true };
        if (search)
            where.name = { contains: search, mode: 'insensitive' };
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            this.prisma.project.findMany({ where, skip, take: Number(limit), include: { _count: { select: { tasks: true } } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.project.count({ where }),
        ]);
        return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
    }
    async getProject(id) {
        const p = await this.prisma.project.findUnique({ where: { id }, include: { tasks: { where: { active: true }, orderBy: { priority: 'desc' } }, milestones: true } });
        if (!p)
            throw new NotFoundException('Proyek tidak ditemukan');
        return p;
    }
    async createProject(dto) { return this.prisma.project.create({ data: dto }); }
    async updateProject(id, dto) { return this.prisma.project.update({ where: { id }, data: dto }); }
    async deleteProject(id) { return this.prisma.project.update({ where: { id }, data: { active: false } }); }
    async getTasks(query) {
        const { projectId, stage, assignedTo, page = 1, limit = 50 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { active: true };
        if (projectId)
            where.projectId = projectId;
        if (stage)
            where.stage = stage;
        if (assignedTo)
            where.assignedTo = assignedTo;
        const [data, total] = await Promise.all([
            this.prisma.task.findMany({ where, skip, take: Number(limit), include: { project: true, milestone: true, subtasks: { where: { active: true } } }, orderBy: { priority: 'desc' } }),
            this.prisma.task.count({ where }),
        ]);
        return { data, total };
    }
    async createTask(dto) { return this.prisma.task.create({ data: dto, include: { project: true } }); }
    async updateTask(id, dto) { return this.prisma.task.update({ where: { id }, data: dto }); }
    async deleteTask(id) { return this.prisma.task.update({ where: { id }, data: { active: false } }); }
    async getMilestones(projectId) { return this.prisma.milestone.findMany({ where: { projectId }, include: { tasks: { where: { active: true } } } }); }
    async createMilestone(dto) { return this.prisma.milestone.create({ data: dto }); }
    async getTimesheets(query) {
        const { taskId, employeeId, page = 1, limit = 20 } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (taskId)
            where.taskId = taskId;
        if (employeeId)
            where.employeeId = employeeId;
        const [data, total] = await Promise.all([
            this.prisma.timesheet.findMany({ where, skip, take: Number(limit), include: { task: { include: { project: true } } }, orderBy: { date: 'desc' } }),
            this.prisma.timesheet.count({ where }),
        ]);
        return { data, total };
    }
    async logTimesheet(dto) { return this.prisma.timesheet.create({ data: dto }); }
    async getStats() {
        const [total, active, done, totalTasks] = await Promise.all([
            this.prisma.project.count(),
            this.prisma.project.count({ where: { status: 'in_progress', active: true } }),
            this.prisma.project.count({ where: { status: 'done' } }),
            this.prisma.task.count({ where: { active: true } }),
        ]);
        return { total, active, done, totalTasks };
    }
};
ProjectService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __metadata("design:paramtypes", [PrismaService])
], ProjectService);
export { ProjectService };
