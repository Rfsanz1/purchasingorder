import { DriverAreasService } from './driver-areas.service.js';
export declare class DriverAreasController {
    private readonly svc;
    constructor(svc: DriverAreasService);
    findAll(): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        areas: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    update(dto: any[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
