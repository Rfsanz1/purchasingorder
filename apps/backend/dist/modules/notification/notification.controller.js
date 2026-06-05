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
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { Permissions } from '../../common/decorators/permissions.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let NotificationController = class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    list(user) {
        return this.notificationService.findAll(user.userId || user.sub || user.id);
    }
    markRead(id) {
        return this.notificationService.markAsRead(id);
    }
    markAllRead(user) {
        return this.notificationService.markAllAsRead(user.userId || user.sub || user.id);
    }
    deleteNotification(id) {
        return this.notificationService.deleteOne(id);
    }
    send(payload) {
        return this.notificationService.create(payload.recipient, payload.title, payload.message);
    }
    sendWhatsApp(payload) {
        return this.notificationService.sendWhatsApp(payload.target, payload.message);
    }
};
__decorate([
    Get(),
    Permissions('notifications.view'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "list", null);
__decorate([
    Put(':id/read'),
    Permissions('notifications.update'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "markRead", null);
__decorate([
    Post('read-all'),
    HttpCode(HttpStatus.OK),
    Permissions('notifications.update'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "markAllRead", null);
__decorate([
    Delete(':id'),
    Permissions('notifications.delete'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "deleteNotification", null);
__decorate([
    Post('send'),
    Permissions('notifications.create'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "send", null);
__decorate([
    Post('whatsapp'),
    Permissions('notifications.create'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sendWhatsApp", null);
NotificationController = __decorate([
    Controller('notifications'),
    UseGuards(JwtAuthGuard, PermissionsGuard),
    __param(0, Inject(NotificationService)),
    __metadata("design:paramtypes", [NotificationService])
], NotificationController);
export { NotificationController };
