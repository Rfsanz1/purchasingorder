var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationGateway_1;
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
let NotificationGateway = NotificationGateway_1 = class NotificationGateway {
    jwtService;
    logger = new Logger(NotificationGateway_1.name);
    server;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    handleConnection(client) {
        const token = client.handshake.auth?.token;
        if (!token) {
            this.logger.warn('Socket connection rejected: missing auth token');
            client.emit('error', { message: 'Authentication required' });
            client.disconnect(true);
            return;
        }
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || 'change-this-secret',
            });
            if (!payload?.email) {
                throw new Error('Token missing email claim');
            }
            client.data.user = payload;
            client.join(`notification:${payload.email}`);
            client.emit('connection:accepted', { message: 'Realtime notification gateway connected' });
            this.logger.log(`Socket connected for ${payload.email}`);
        }
        catch (error) {
            this.logger.warn(`Socket auth failed: ${error.message}`);
            client.emit('error', { message: 'Authentication failed' });
            client.disconnect(true);
        }
    }
    broadcastNotification(payload) {
        this.server.to(`notification:${payload.recipient}`).emit(`notification:${payload.recipient}`, payload);
    }
};
__decorate([
    WebSocketServer(),
    __metadata("design:type", Server)
], NotificationGateway.prototype, "server", void 0);
NotificationGateway = NotificationGateway_1 = __decorate([
    WebSocketGateway({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [JwtService])
], NotificationGateway);
export { NotificationGateway };
