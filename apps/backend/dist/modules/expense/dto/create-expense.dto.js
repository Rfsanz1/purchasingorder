var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber, IsArray, IsDateString } from 'class-validator';
export class CreateExpenseDto {
    id;
    number;
    date;
    contactId;
    accountId;
    paymentAccountId;
    amount;
    taxId;
    taxAmount;
    totalAmount;
    description;
    attachment;
    tags;
    branchId;
    createdBy;
}
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "id", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "number", void 0);
__decorate([
    ApiProperty({ example: '2026-06-04' }),
    IsNotEmpty(),
    IsDateString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "date", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "contactId", void 0);
__decorate([
    ApiProperty({ example: 'a1b2c3d4' }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "accountId", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "paymentAccountId", void 0);
__decorate([
    ApiProperty({ example: 1500000 }),
    IsNotEmpty(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "taxId", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "taxAmount", void 0);
__decorate([
    ApiProperty({ example: 1500000 }),
    IsNotEmpty(),
    IsNumber(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "totalAmount", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "description", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "attachment", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString({ each: true }),
    IsArray(),
    __metadata("design:type", Array)
], CreateExpenseDto.prototype, "tags", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "branchId", void 0);
__decorate([
    ApiProperty({ example: 'user-123' }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "createdBy", void 0);
