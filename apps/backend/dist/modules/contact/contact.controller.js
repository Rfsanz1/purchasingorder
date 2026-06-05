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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service.js';
import { CreateContactDto } from './dto/create-contact.dto.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';
import { QueryContactDto } from './dto/query-contact.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let ContactController = class ContactController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getSummary() { return this.svc.getSummary(); }
    findAll(q) { return this.svc.findAll(q); }
    findOne(id) { return this.svc.findOne(id); }
    create(dto) { return this.svc.create(dto); }
    update(id, dto) { return this.svc.update(id, dto); }
    remove(id) { return this.svc.remove(id); }
    getTransactions(id) { return this.svc.getTransactions(id); }
    getStatement(id) { return this.svc.getStatement(id); }
    getBalance(id) { return this.svc.getBalance(id); }
};
__decorate([
    Get('summary'),
    ApiOperation({ summary: 'Ringkasan statistik kontak' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "getSummary", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Daftar kontak dengan filter' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryContactDto]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Detail kontak' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "findOne", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Buat kontak baru' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateContactDto]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "create", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Update kontak' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateContactDto]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Nonaktifkan kontak (soft delete)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "remove", null);
__decorate([
    Get(':id/transactions'),
    ApiOperation({ summary: 'Semua transaksi kontak' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "getTransactions", null);
__decorate([
    Get(':id/statement'),
    ApiOperation({ summary: 'Laporan hutang-piutang kontak' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "getStatement", null);
__decorate([
    Get(':id/balance'),
    ApiOperation({ summary: 'Saldo hutang/piutang saat ini' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "getBalance", null);
ContactController = __decorate([
    ApiTags('contacts'),
    ApiBearerAuth('access-token'),
    Controller('contacts'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [ContactService])
], ContactController);
export { ContactController };
