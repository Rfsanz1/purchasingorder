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
import { Controller, Get, Post, Put, Delete, Param, Body, Query, Res, HttpStatus, } from '@nestjs/common';
import { TaxService } from './tax.service.js';
import { EFakturService } from './efaktur.service.js';
import { CreateTaxDto, UpdateTaxDto, CalculatePPNDto, CalculatePPh21Dto, CalculatePPh23Dto, CalculatePPh4a2Dto, } from './dto/create-tax.dto.js';
import { EFakturStatus } from '@prisma/client';
let TaxController = class TaxController {
    taxService;
    efakturService;
    constructor(taxService, efakturService) {
        this.taxService = taxService;
        this.efakturService = efakturService;
    }
    // ─── CRUD JENIS PAJAK ─────────────────────────────────────────────────────
    findAll() {
        return this.taxService.findAll();
    }
    getPTKPOptions() {
        return this.taxService.getPTKPOptions();
    }
    getPPh23Options() {
        return this.taxService.getPPh23Options();
    }
    getPPh4a2Options() {
        return this.taxService.getPPh4a2Options();
    }
    findOne(id) {
        return this.taxService.findOne(id);
    }
    create(dto) {
        return this.taxService.create(dto);
    }
    update(id, dto) {
        return this.taxService.update(id, dto);
    }
    remove(id) {
        return this.taxService.remove(id);
    }
    // ─── KALKULATOR PAJAK ─────────────────────────────────────────────────────
    calculatePPN(dto) {
        return this.taxService.calculatePPN(dto.amount, dto.taxRate);
    }
    calculatePPh21(dto) {
        return this.taxService.calculatePPh21(dto.grossSalary, dto.statusPajak);
    }
    calculatePPh23(dto) {
        return this.taxService.calculatePPh23(dto.amount, dto.jenis);
    }
    calculatePPh4a2(dto) {
        return this.taxService.calculatePPh4a2(dto.amount, dto.jenis);
    }
    // ─── E-FAKTUR ─────────────────────────────────────────────────────────────
    getEFakturList(periode) {
        return this.efakturService.findAll(periode);
    }
    getRekapPPN(periode) {
        return this.efakturService.getRekapPPN(periode);
    }
    async exportCSV(periode, res) {
        const csv = await this.efakturService.exportCSV(periode);
        const filename = `efaktur_${periode}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(HttpStatus.OK).send('\uFEFF' + csv);
    }
    getEFaktur(id) {
        return this.efakturService.findOne(id);
    }
    createEFaktur(body) {
        return this.efakturService.createEFaktur({
            ...body,
            tanggal: body.tanggal ? new Date(body.tanggal) : undefined,
        });
    }
    createFromSale(saleId) {
        return this.efakturService.createFromSaleInvoice(saleId);
    }
    updateEFakturStatus(id, status) {
        return this.efakturService.updateStatus(id, status);
    }
    deleteEFaktur(id) {
        return this.efakturService.remove(id);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "findAll", null);
__decorate([
    Get('options/ptkp'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getPTKPOptions", null);
__decorate([
    Get('options/pph23'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getPPh23Options", null);
__decorate([
    Get('options/pph4a2'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getPPh4a2Options", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "findOne", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTaxDto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "create", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTaxDto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "remove", null);
__decorate([
    Post('calculate/ppn'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatePPNDto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "calculatePPN", null);
__decorate([
    Post('calculate/pph21'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatePPh21Dto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "calculatePPh21", null);
__decorate([
    Post('calculate/pph23'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatePPh23Dto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "calculatePPh23", null);
__decorate([
    Post('calculate/pph4a2'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CalculatePPh4a2Dto]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "calculatePPh4a2", null);
__decorate([
    Get('efaktur/list'),
    __param(0, Query('periode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getEFakturList", null);
__decorate([
    Get('efaktur/rekap-ppn'),
    __param(0, Query('periode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getRekapPPN", null);
__decorate([
    Get('efaktur/export-csv'),
    __param(0, Query('periode')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TaxController.prototype, "exportCSV", null);
__decorate([
    Get('efaktur/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "getEFaktur", null);
__decorate([
    Post('efaktur'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "createEFaktur", null);
__decorate([
    Post('efaktur/from-sale/:saleId'),
    __param(0, Param('saleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "createFromSale", null);
__decorate([
    Put('efaktur/:id/status'),
    __param(0, Param('id')),
    __param(1, Body('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "updateEFakturStatus", null);
__decorate([
    Delete('efaktur/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TaxController.prototype, "deleteEFaktur", null);
TaxController = __decorate([
    Controller('tax'),
    __metadata("design:paramtypes", [TaxService,
        EFakturService])
], TaxController);
export { TaxController };
