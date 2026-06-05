import { PrismaService } from '../../database/prisma.service.js';
export declare class DriverAreasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        areas: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    update(data: any[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
