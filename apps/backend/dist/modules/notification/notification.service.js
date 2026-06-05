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
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { NotificationGateway } from './notification.gateway.js';
let NotificationService = class NotificationService {
    prisma;
    notificationGateway;
    constructor(prisma, notificationGateway) {
        this.prisma = prisma;
        this.notificationGateway = notificationGateway;
    }
    async findAll(recipient) {
        return this.prisma.notification.findMany({
            where: { recipient },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async markAsRead(id) {
        return this.prisma.notification.update({
            where: { id },
            data: { readAt: new Date(), status: 'read' },
        });
    }
    async create(recipient, title, message) {
        const notification = await this.prisma.notification.create({
            data: { recipient, title, message, status: 'pending' },
        });
        this.notificationGateway.broadcastNotification({ recipient, title, message });
        return notification;
    }
    async markAllAsRead(recipient) {
        await this.prisma.notification.updateMany({
            where: { recipient, readAt: null },
            data: { readAt: new Date(), status: 'read' },
        });
        return { data: null, message: 'Semua notifikasi telah dibaca' };
    }
    async deleteOne(id) {
        await this.prisma.notification.delete({ where: { id } });
        return { data: null, message: 'Notifikasi berhasil dihapus' };
    }
    async sendWhatsApp(target, message) {
        if (!process.env.FONNTE_TOKEN)
            return { skipped: true, reason: 'FONNTE_TOKEN tidak dikonfigurasi' };
        try {
            const resp = await fetch('https://api.fonnte.com/send', {
                method: 'POST',
                headers: { Authorization: process.env.FONNTE_TOKEN },
                body: JSON.stringify({ target, message }),
            });
            const result = await resp.json();
            await this.prisma.notification.create({
                data: {
                    recipient: target,
                    title: 'WhatsApp',
                    message,
                    status: result.status ? 'sent' : 'failed',
                },
            });
            return result;
        }
        catch (e) {
            return { error: e.message };
        }
    }
};
NotificationService = __decorate([
    Injectable(),
    __param(0, Inject(PrismaService)),
    __param(1, Inject(NotificationGateway)),
    __metadata("design:paramtypes", [PrismaService,
        NotificationGateway])
], NotificationService);
export { NotificationService };
