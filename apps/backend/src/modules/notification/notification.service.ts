import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { NotificationGateway } from './notification.gateway.js';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async findAll(recipient: string) {
    return this.prisma.notification.findMany({
      where: { recipient },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date(), status: 'read' },
    });
  }

  async create(recipient: string, title: string, message: string) {
    const notification = await this.prisma.notification.create({
      data: { recipient, title, message, status: 'pending' },
    });

    this.notificationGateway.broadcastNotification({
      recipient,
      title,
      message,
    });

    return notification;
  }
}
