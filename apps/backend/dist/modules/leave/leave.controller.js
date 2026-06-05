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
import { Controller, Get, Post, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { LeaveService } from './leave.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let LeaveController = class LeaveController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getTypes() { return this.svc.getLeaveTypes(); }
    createType(dto) { return this.svc.createLeaveType(dto); }
    getAllocations(q) { return this.svc.getAllocations(q); }
    createAllocation(dto) { return this.svc.createAllocation(dto); }
    getRequests(q) { return this.svc.getRequests(q); }
    createRequest(dto) { return this.svc.createRequest(dto); }
    approveRequest(id, user) { return this.svc.approveRequest(id, user?.sub ?? 'system'); }
    refuseRequest(id) { return this.svc.refuseRequest(id); }
    getBalance(empId, year) { return this.svc.getLeaveBalance(empId, Number(year) || new Date().getFullYear()); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getStats", null);
__decorate([
    Get('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getTypes", null);
__decorate([
    Post('types'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "createType", null);
__decorate([
    Get('allocations'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getAllocations", null);
__decorate([
    Post('allocations'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "createAllocation", null);
__decorate([
    Get('requests'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getRequests", null);
__decorate([
    Post('requests'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "createRequest", null);
__decorate([
    Post('requests/:id/approve'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "approveRequest", null);
__decorate([
    Post('requests/:id/refuse'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "refuseRequest", null);
__decorate([
    Get('balance/:employeeId'),
    __param(0, Param('employeeId')),
    __param(1, Query('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeaveController.prototype, "getBalance", null);
LeaveController = __decorate([
    Controller('leave'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(LeaveService)),
    __metadata("design:paramtypes", [LeaveService])
], LeaveController);
export { LeaveController };
