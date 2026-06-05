import { NotificationService } from './notification.service.js';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    list(user: any): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        recipient: string;
        title: string;
        message: string;
        readAt: Date | null;
    }[]>;
    markRead(id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        recipient: string;
        title: string;
        message: string;
        readAt: Date | null;
    }>;
    markAllRead(user: any): Promise<{
        data: any;
        message: string;
    }>;
    deleteNotification(id: string): Promise<{
        data: any;
        message: string;
    }>;
    send(payload: {
        recipient: string;
        title: string;
        message: string;
    }): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        recipient: string;
        title: string;
        message: string;
        readAt: Date | null;
    }>;
    sendWhatsApp(payload: {
        target: string;
        message: string;
    }): Promise<any>;
}
