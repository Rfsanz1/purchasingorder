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
import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let ProjectController = class ProjectController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getProjects(q) { return this.svc.getProjects(q); }
    createProject(dto) { return this.svc.createProject(dto); }
    getProject(id) { return this.svc.getProject(id); }
    updateProject(id, dto) { return this.svc.updateProject(id, dto); }
    deleteProject(id) { return this.svc.deleteProject(id); }
    getTasks(q) { return this.svc.getTasks(q); }
    createTask(dto) { return this.svc.createTask(dto); }
    updateTask(id, dto) { return this.svc.updateTask(id, dto); }
    deleteTask(id) { return this.svc.deleteTask(id); }
    getMilestones(id) { return this.svc.getMilestones(id); }
    createMilestone(dto) { return this.svc.createMilestone(dto); }
    getTimesheets(q) { return this.svc.getTimesheets(q); }
    logTimesheet(dto) { return this.svc.logTimesheet(dto); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getStats", null);
__decorate([
    Get('projects'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getProjects", null);
__decorate([
    Post('projects'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "createProject", null);
__decorate([
    Get('projects/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getProject", null);
__decorate([
    Put('projects/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "updateProject", null);
__decorate([
    Delete('projects/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "deleteProject", null);
__decorate([
    Get('tasks'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getTasks", null);
__decorate([
    Post('tasks'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "createTask", null);
__decorate([
    Put('tasks/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "updateTask", null);
__decorate([
    Delete('tasks/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "deleteTask", null);
__decorate([
    Get('projects/:id/milestones'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getMilestones", null);
__decorate([
    Post('milestones'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "createMilestone", null);
__decorate([
    Get('timesheets'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "getTimesheets", null);
__decorate([
    Post('timesheets'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProjectController.prototype, "logTimesheet", null);
ProjectController = __decorate([
    Controller('project'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(ProjectService)),
    __metadata("design:paramtypes", [ProjectService])
], ProjectController);
export { ProjectController };
