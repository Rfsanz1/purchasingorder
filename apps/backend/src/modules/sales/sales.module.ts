import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller.js';
import { SalesService } from './sales.service.js';
import { PrismaService } from '../../database/prisma.service.js';

@Module({ controllers: [SalesController], providers: [SalesService, PrismaService], exports: [SalesService] })
export class SalesModule {}
