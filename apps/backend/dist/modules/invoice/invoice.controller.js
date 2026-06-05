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
import { Body, Controller, Delete, Get, Header, Inject, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let InvoiceController = class InvoiceController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getStats() { return this.svc.getStats(); }
    getAging() { return this.svc.getAging(); }
    findAll(q) { return this.svc.findAll(q); }
    findOne(id) { return this.svc.findOne(id); }
    create(dto) { return this.svc.create(dto); }
    update(id, dto) { return this.svc.update(id, dto); }
    remove(id) { return this.svc.delete(id); }
    send(id) { return this.svc.send(id); }
    getPayments(id) { return this.svc.getPayments(id); }
    addPayment(id, dto) { return this.svc.addPayment(id, dto); }
    getCreditNotes(id) { return this.svc.getCreditNotes(id); }
    issueCreditNote(id, dto) { return this.svc.issueCreditNote(id, dto); }
    sendReminder(id, dto) { return this.svc.sendReminder(id, dto); }
    sendWhatsApp(id, dto) { return this.svc.sendWhatsApp(id, dto); }
    setRecurring(id, dto) { return this.svc.setRecurring(id, dto); }
    deleteRecurring(id) { return this.svc.deleteRecurring(id); }
    createPaymentLink(id, dto) { return this.svc.createPaymentLink(id, dto); }
    async getPdf(id, res) {
        const html = await this.svc.getPdfHtml(id);
        res.send(html);
    }
};
__decorate([
    Get('stats'),
    ApiOperation({ summary: 'Statistik invoice' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "getStats", null);
__decorate([
    Get('aging'),
    ApiOperation({ summary: 'AR aging report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "getAging", null);
__decorate([
    Get(),
    ApiOperation({ summary: 'Daftar invoice' }),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Detail invoice' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "findOne", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Buat invoice baru' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "create", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Update invoice' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Hapus invoice draft' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "remove", null);
__decorate([
    Post(':id/send'),
    ApiOperation({ summary: 'Kirim invoice (status → sent)' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "send", null);
__decorate([
    Get(':id/payments'),
    ApiOperation({ summary: 'Daftar pembayaran invoice' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "getPayments", null);
__decorate([
    Post(':id/payments'),
    ApiOperation({ summary: 'Catat pembayaran' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "addPayment", null);
__decorate([
    Get(':id/credit-notes'),
    ApiOperation({ summary: 'Daftar credit note' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "getCreditNotes", null);
__decorate([
    Post(':id/credit-notes'),
    ApiOperation({ summary: 'Terbitkan credit note' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "issueCreditNote", null);
__decorate([
    Post(':id/send-reminder'),
    ApiOperation({ summary: 'Kirim reminder pembayaran' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "sendReminder", null);
__decorate([
    Post(':id/send-whatsapp'),
    ApiOperation({ summary: 'Kirim invoice via WhatsApp' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "sendWhatsApp", null);
__decorate([
    Post(':id/set-recurring'),
    ApiOperation({ summary: 'Aktifkan recurring invoice' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "setRecurring", null);
__decorate([
    Delete(':id/recurring'),
    ApiOperation({ summary: 'Nonaktifkan recurring invoice' }),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "deleteRecurring", null);
__decorate([
    Post(':id/payment-link'),
    ApiOperation({ summary: 'Buat payment link' }),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "createPaymentLink", null);
__decorate([
    Get(':id/pdf'),
    ApiOperation({ summary: 'Preview HTML invoice (PDF-ready)' }),
    Header('Content-Type', 'text/html'),
    __param(0, Param('id')),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getPdf", null);
InvoiceController = __decorate([
    ApiTags('invoices'),
    ApiBearerAuth('access-token'),
    Controller('invoices'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(InvoiceService)),
    __metadata("design:paramtypes", [InvoiceService])
], InvoiceController);
export { InvoiceController };
