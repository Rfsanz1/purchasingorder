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
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { BranchService } from './branch.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let BranchController = class BranchController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getCompanies() { return this.svc.getCompanies(); }
    getCompany(id) { return this.svc.getCompany(id); }
    upsertCompany(dto) { return this.svc.upsertCompany(dto); }
    getBranches(cid) { return this.svc.getBranches(cid); }
    getBranch(id) { return this.svc.getBranch(id); }
    createBranch(dto) { return this.svc.createBranch(dto); }
    updateBranch(id, d) { return this.svc.updateBranch(id, d); }
    deleteBranch(id) { return this.svc.deleteBranch(id); }
};
__decorate([
    Get('companies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "getCompanies", null);
__decorate([
    Get('companies/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "getCompany", null);
__decorate([
    Post('companies'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "upsertCompany", null);
__decorate([
    Get(),
    __param(0, Query('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "getBranches", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "getBranch", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "createBranch", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "updateBranch", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BranchController.prototype, "deleteBranch", null);
BranchController = __decorate([
    Controller('branch'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [BranchService])
], BranchController);
export { BranchController };
