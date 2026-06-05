import { PrismaService } from '../../database/prisma.service.js';
import { NotificationGateway } from './notification.gateway.js';
export declare class NotificationService {
    private readonly prisma;
    private readonly notificationGateway;
    constructor(prisma: PrismaService, notificationGateway: NotificationGateway);
    findAll(recipient: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        recipient: string;
        title: string;
        message: string;
        readAt: Date | null;
    }[]>;
    markAsRead(id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        recipient: string;
        title: string;
        message: string;
        readAt: Date | null;
    }>;
    create(recipient: string, title: string, message: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        recipient: string;
        title: string;
        message: string;
        readAt: Date | null;
    }>;
    markAllAsRead(recipient: string): Promise<{
        data: any;
        message: string;
    }>;
    deleteOne(id: string): Promise<{
        data: any;
        message: string;
    }>;
    sendWhatsApp(target: string, message: string): Promise<any>;
}
