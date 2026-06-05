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
import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AssetService } from './asset.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let AssetController = class AssetController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getAssets(q) { return this.svc.getAssets(q); }
    getRegister(d) { return this.svc.getAssetRegister(d ? new Date(d) : undefined); }
    getKategori() { return this.svc.getKategori(); }
    getAsset(id) { return this.svc.getAsset(id); }
    createAsset(dto) { return this.svc.createAsset(dto); }
    updateAsset(id, d) { return this.svc.updateAsset(id, d); }
    getSchedule(id) { return this.svc.getDepreciationSchedule(id); }
    dispose(id, dto) {
        return this.svc.disposeAsset(id, new Date(dto.tanggalDisposal), Number(dto.nilaiDisposal), dto.note);
    }
    runDepreciation(dto) {
        return this.svc.runMonthlyDepreciation(dto.bulan, dto.tahun);
    }
    calcDepreciation(dto) {
        return this.svc.calculateDepreciation(dto.assetId, dto.bulan, dto.tahun);
    }
};
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "getAssets", null);
__decorate([
    Get('register'),
    __param(0, Query('asOf')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "getRegister", null);
__decorate([
    Get('kategori'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "getKategori", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "getAsset", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "createAsset", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "updateAsset", null);
__decorate([
    Get(':id/schedule'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "getSchedule", null);
__decorate([
    Post(':id/dispose'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "dispose", null);
__decorate([
    Post('depreciation/run'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "runDepreciation", null);
__decorate([
    Post('depreciation/calculate'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "calcDepreciation", null);
AssetController = __decorate([
    Controller('assets'),
    UseGuards(JwtAuthGuard),
    __metadata("design:paramtypes", [AssetService])
], AssetController);
export { AssetController };
