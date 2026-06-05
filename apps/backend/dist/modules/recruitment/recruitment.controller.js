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
import { Controller, Get, Post, Put, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let RecruitmentController = class RecruitmentController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getPositions(q) { return this.svc.getPositions(q); }
    createPosition(dto) { return this.svc.createPosition(dto); }
    updatePosition(id, dto) { return this.svc.updatePosition(id, dto); }
    getApplications(q) { return this.svc.getApplications(q); }
    createApplication(dto) { return this.svc.createApplication(dto); }
    getApplication(id) { return this.svc.getApplication(id); }
    updateApplication(id, dto) { return this.svc.updateApplication(id, dto); }
    advanceStage(id, stage) { return this.svc.advanceStage(id, stage); }
    refuseApplication(id, reason) { return this.svc.refuseApplication(id, reason); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "getStats", null);
__decorate([
    Get('positions'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "getPositions", null);
__decorate([
    Post('positions'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "createPosition", null);
__decorate([
    Put('positions/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "updatePosition", null);
__decorate([
    Get('applications'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "getApplications", null);
__decorate([
    Post('applications'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "createApplication", null);
__decorate([
    Get('applications/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "getApplication", null);
__decorate([
    Put('applications/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "updateApplication", null);
__decorate([
    Post('applications/:id/advance'),
    __param(0, Param('id')),
    __param(1, Body('stage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "advanceStage", null);
__decorate([
    Post('applications/:id/refuse'),
    __param(0, Param('id')),
    __param(1, Body('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RecruitmentController.prototype, "refuseApplication", null);
RecruitmentController = __decorate([
    Controller('recruitment'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(RecruitmentService)),
    __metadata("design:paramtypes", [RecruitmentService])
], RecruitmentController);
export { RecruitmentController };
