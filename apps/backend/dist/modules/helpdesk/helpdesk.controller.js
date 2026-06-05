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
import { HelpdeskService } from './helpdesk.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let HelpdeskController = class HelpdeskController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getTeams() { return this.svc.getTeams(); }
    createTeam(dto) { return this.svc.createTeam(dto); }
    getTickets(q) { return this.svc.getTickets(q); }
    createTicket(dto) { return this.svc.createTicket(dto); }
    getTicket(id) { return this.svc.getTicket(id); }
    updateTicket(id, dto) { return this.svc.updateTicket(id, dto); }
    closeTicket(id, dto) { return this.svc.closeTicket(id, dto.rating, dto.ratingComment); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HelpdeskController.prototype, "getStats", null);
__decorate([
    Get('teams'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HelpdeskController.prototype, "getTeams", null);
__decorate([
    Post('teams'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HelpdeskController.prototype, "createTeam", null);
__decorate([
    Get('tickets'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HelpdeskController.prototype, "getTickets", null);
__decorate([
    Post('tickets'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HelpdeskController.prototype, "createTicket", null);
__decorate([
    Get('tickets/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HelpdeskController.prototype, "getTicket", null);
__decorate([
    Put('tickets/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HelpdeskController.prototype, "updateTicket", null);
__decorate([
    Post('tickets/:id/close'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HelpdeskController.prototype, "closeTicket", null);
HelpdeskController = __decorate([
    Controller('helpdesk'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(HelpdeskService)),
    __metadata("design:paramtypes", [HelpdeskService])
], HelpdeskController);
export { HelpdeskController };
