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
import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExpenseService } from './expense.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let ExpenseController = class ExpenseController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    findAll(q) {
        return this.svc.findAll(q);
    }
    getSummary(q) {
        return this.svc.summary(q);
    }
    byAccount(q) {
        return this.svc.byAccount(q);
    }
    findOne(id) {
        return this.svc.findOne(id);
    }
    findExpenseJournals(id) {
        return this.svc.getExpenseJournals(id);
    }
    create(dto) {
        return this.svc.create(dto);
    }
    update(id, dto) {
        return this.svc.update(id, dto);
    }
    remove(id) {
        return this.svc.remove(id);
    }
    submit(id) {
        return this.svc.submit(id);
    }
    approve(id) {
        return this.svc.approve(id);
    }
    reject(id) {
        return this.svc.reject(id);
    }
    pay(id, dto) {
        return this.svc.pay(id, dto.paymentAccountId, dto.paidBy || 'system');
    }
    import(file, body) {
        if (file && file.buffer)
            return this.svc.import(file.buffer);
        if (body && body.fileBase64)
            return this.svc.import(Buffer.from(body.fileBase64, 'base64'));
        return { message: 'No file provided' };
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Daftar expense dengan filter' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "findAll", null);
__decorate([
    Get('reports/summary'),
    ApiOperation({ summary: 'Ringkasan biaya berdasarkan filter' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "getSummary", null);
__decorate([
    Get('reports/by-account'),
    ApiOperation({ summary: 'Ringkasan biaya per akun' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "byAccount", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Detail expense' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "findOne", null);
__decorate([
    Get(':id/journals'),
    ApiOperation({ summary: 'Jurnal terkait expense' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "findExpenseJournals", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Buat expense baru' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateExpenseDto]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "create", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Update expense' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Hapus expense (hanya draft)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "remove", null);
__decorate([
    Post(':id/submit'),
    ApiOperation({ summary: 'Submit expense untuk approval' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "submit", null);
__decorate([
    Post(':id/approve'),
    ApiOperation({ summary: 'Approve expense' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "approve", null);
__decorate([
    Post(':id/reject'),
    ApiOperation({ summary: 'Reject expense dan kembali ke draft' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "reject", null);
__decorate([
    Post(':id/pay'),
    ApiOperation({ summary: 'Bayar expense yang sudah disetujui' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "pay", null);
__decorate([
    Post('import'),
    UseInterceptors(FileInterceptor('file')),
    ApiOperation({ summary: 'Import expense dari file Excel' }),
    __param(0, UploadedFile()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ExpenseController.prototype, "import", null);
ExpenseController = __decorate([
    ApiTags('expenses'),
    ApiBearerAuth('access-token'),
    Controller('expenses'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(ExpenseService)),
    __metadata("design:paramtypes", [ExpenseService])
], ExpenseController);
export { ExpenseController };
