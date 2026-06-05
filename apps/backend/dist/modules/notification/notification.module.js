var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationController } from './notification.controller.js';
import { NotificationService } from './notification.service.js';
import { NotificationGateway } from './notification.gateway.js';
import { PrismaService } from '../../database/prisma.service.js';
let NotificationModule = class NotificationModule {
};
NotificationModule = __decorate([
    Module({
        imports: [
            JwtModule.register({
                secret: process.env.JWT_SECRET || 'change-this-secret',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
            }),
        ],
        controllers: [NotificationController],
        providers: [NotificationService, NotificationGateway, PrismaService],
        exports: [NotificationService],
    })
], NotificationModule);
export { NotificationModule };
