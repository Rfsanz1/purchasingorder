var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateContactDto {
    code;
    name;
    type;
    email;
    phone;
    mobile;
    address;
    city;
    province;
    postalCode;
    country;
    npwp;
    nik;
    termOfPayment;
    creditLimit;
    currency;
    discountPercent;
    bankName;
    bankAccountNo;
    bankAccountName;
    notes;
    isActive;
    companyId;
    branchId;
}
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "code", void 0);
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ type: [String], example: ['customer'] }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateContactDto.prototype, "type", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "email", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "phone", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "mobile", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "address", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "city", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "province", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "postalCode", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "country", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "npwp", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "nik", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateContactDto.prototype, "termOfPayment", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateContactDto.prototype, "creditLimit", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "currency", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateContactDto.prototype, "discountPercent", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "bankName", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "bankAccountNo", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "bankAccountName", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "notes", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateContactDto.prototype, "isActive", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "companyId", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateContactDto.prototype, "branchId", void 0);
