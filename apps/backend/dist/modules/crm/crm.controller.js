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
import { CrmService } from './crm.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let CrmController = class CrmController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getLeads(q) { return this.svc.getLeads(q); }
    createLead(dto) { return this.svc.createLead(dto); }
    getLead(id) { return this.svc.getLead(id); }
    updateLead(id, dto) { return this.svc.updateLead(id, dto); }
    deleteLead(id) { return this.svc.deleteLead(id); }
    convertToOpportunity(id) { return this.svc.convertToOpportunity(id); }
    markAsWon(id) { return this.svc.markAsWon(id); }
    markAsLost(id, reason) { return this.svc.markAsLost(id, reason); }
    getPipeline(q) { return this.svc.getPipeline(q); }
    getSalesTeams() { return this.svc.getSalesTeams(); }
    createSalesTeam(dto) { return this.svc.createSalesTeam(dto); }
    getActivities(q) { return this.svc.getActivities(q); }
    scheduleActivity(dto) { return this.svc.scheduleActivity(dto); }
    markActivityDone(id) { return this.svc.markActivityDone(id); }
    getWinLoss(q) { return this.svc.getWinLossReport(q); }
    getLostReasons() { return this.svc.getLostReasons(); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getStats", null);
__decorate([
    Get('leads'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getLeads", null);
__decorate([
    Post('leads'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "createLead", null);
__decorate([
    Get('leads/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getLead", null);
__decorate([
    Put('leads/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "updateLead", null);
__decorate([
    Delete('leads/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "deleteLead", null);
__decorate([
    Post('leads/:id/convert'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "convertToOpportunity", null);
__decorate([
    Post('leads/:id/won'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "markAsWon", null);
__decorate([
    Post('leads/:id/lost'),
    __param(0, Param('id')),
    __param(1, Body('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "markAsLost", null);
__decorate([
    Get('pipeline'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getPipeline", null);
__decorate([
    Get('teams'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getSalesTeams", null);
__decorate([
    Post('teams'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "createSalesTeam", null);
__decorate([
    Get('activities'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getActivities", null);
__decorate([
    Post('activities'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "scheduleActivity", null);
__decorate([
    Post('activities/:id/done'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "markActivityDone", null);
__decorate([
    Get('analysis/win-loss'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getWinLoss", null);
__decorate([
    Get('lost-reasons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "getLostReasons", null);
CrmController = __decorate([
    Controller('crm'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(CrmService)),
    __metadata("design:paramtypes", [CrmService])
], CrmController);
export { CrmController };
