var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsEnum, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { TaxType } from '@prisma/client';
export class CreateTaxDto {
    kode;
    nama;
    tipe;
    rate;
    isActive;
    accountId;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateTaxDto.prototype, "kode", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateTaxDto.prototype, "nama", void 0);
__decorate([
    IsEnum(TaxType),
    __metadata("design:type", String)
], CreateTaxDto.prototype, "tipe", void 0);
__decorate([
    IsNumber(),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], CreateTaxDto.prototype, "rate", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateTaxDto.prototype, "isActive", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTaxDto.prototype, "accountId", void 0);
export class UpdateTaxDto {
    nama;
    tipe;
    rate;
    isActive;
    accountId;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateTaxDto.prototype, "nama", void 0);
__decorate([
    IsOptional(),
    IsEnum(TaxType),
    __metadata("design:type", String)
], UpdateTaxDto.prototype, "tipe", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], UpdateTaxDto.prototype, "rate", void 0);
__decorate([
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateTaxDto.prototype, "isActive", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateTaxDto.prototype, "accountId", void 0);
export class CalculatePPNDto {
    amount;
    taxRate;
}
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], CalculatePPNDto.prototype, "amount", void 0);
__decorate([
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CalculatePPNDto.prototype, "taxRate", void 0);
export class CalculatePPh21Dto {
    grossSalary;
    statusPajak;
}
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], CalculatePPh21Dto.prototype, "grossSalary", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CalculatePPh21Dto.prototype, "statusPajak", void 0);
export class CalculatePPh23Dto {
    amount;
    jenis;
}
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], CalculatePPh23Dto.prototype, "amount", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CalculatePPh23Dto.prototype, "jenis", void 0);
export class CalculatePPh4a2Dto {
    amount;
    jenis;
}
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], CalculatePPh4a2Dto.prototype, "amount", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], CalculatePPh4a2Dto.prototype, "jenis", void 0);
export class ExportEFakturDto {
    periode;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], ExportEFakturDto.prototype, "periode", void 0);
export class RekapPPNDto {
    periode;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], RekapPPNDto.prototype, "periode", void 0);
