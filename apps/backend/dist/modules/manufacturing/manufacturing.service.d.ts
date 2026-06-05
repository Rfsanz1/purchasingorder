import { PrismaService } from '../../database/prisma.service.js';
export declare class ManufacturingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateMoNo;
    getBoms(query: any): Promise<{
        data: ({
            components: {
                id: string;
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                bomId: string;
                uom: string;
            }[];
        } & {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            reference: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getBom(id: string): Promise<{
        components: {
            id: string;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            bomId: string;
            uom: string;
        }[];
    } & {
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    createBom(dto: any): Promise<{
        components: {
            id: string;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            bomId: string;
            uom: string;
        }[];
    } & {
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    updateBom(id: string, dto: any): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        reference: string | null;
    }>;
    getWorkCenters(): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        code: string;
        capacity: import("@prisma/client/runtime/library").Decimal;
        timeEff: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    createWorkCenter(dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        code: string;
        capacity: import("@prisma/client/runtime/library").Decimal;
        timeEff: import("@prisma/client/runtime/library").Decimal;
    }>;
    getOrders(query: any): Promise<{
        data: ({
            bom: {
                components: {
                    id: string;
                    productId: string;
                    qty: import("@prisma/client/runtime/library").Decimal;
                    bomId: string;
                    uom: string;
                }[];
            } & {
                id: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                reference: string | null;
            };
            workOrders: ({
                workCenter: {
                    id: string;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    code: string;
                    capacity: import("@prisma/client/runtime/library").Decimal;
                    timeEff: import("@prisma/client/runtime/library").Decimal;
                };
            } & {
                status: string;
                id: string;
                name: string;
                moId: string;
                workCenterId: string;
                duration: import("@prisma/client/runtime/library").Decimal;
                startedAt: Date | null;
                finishedAt: Date | null;
            })[];
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            bomId: string | null;
            noMo: string;
            qtyProduced: import("@prisma/client/runtime/library").Decimal;
            scheduledDate: Date;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getOrder(id: string): Promise<{
        bom: {
            components: {
                id: string;
                productId: string;
                qty: import("@prisma/client/runtime/library").Decimal;
                bomId: string;
                uom: string;
            }[];
        } & {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            productId: string;
            qty: import("@prisma/client/runtime/library").Decimal;
            reference: string | null;
        };
        workOrders: ({
            workCenter: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                code: string;
                capacity: import("@prisma/client/runtime/library").Decimal;
                timeEff: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            status: string;
            id: string;
            name: string;
            moId: string;
            workCenterId: string;
            duration: import("@prisma/client/runtime/library").Decimal;
            startedAt: Date | null;
            finishedAt: Date | null;
        })[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        bomId: string | null;
        noMo: string;
        qtyProduced: import("@prisma/client/runtime/library").Decimal;
        scheduledDate: Date;
    }>;
    createOrder(dto: any): Promise<{
        workOrders: {
            status: string;
            id: string;
            name: string;
            moId: string;
            workCenterId: string;
            duration: import("@prisma/client/runtime/library").Decimal;
            startedAt: Date | null;
            finishedAt: Date | null;
        }[];
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        bomId: string | null;
        noMo: string;
        qtyProduced: import("@prisma/client/runtime/library").Decimal;
        scheduledDate: Date;
    }>;
    confirmOrder(id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        bomId: string | null;
        noMo: string;
        qtyProduced: import("@prisma/client/runtime/library").Decimal;
        scheduledDate: Date;
    }>;
    startOrder(id: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        bomId: string | null;
        noMo: string;
        qtyProduced: import("@prisma/client/runtime/library").Decimal;
        scheduledDate: Date;
    }>;
    completeOrder(id: string, qtyProduced: number): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        qty: import("@prisma/client/runtime/library").Decimal;
        bomId: string | null;
        noMo: string;
        qtyProduced: import("@prisma/client/runtime/library").Decimal;
        scheduledDate: Date;
    }>;
    getStats(): Promise<{
        total: number;
        draft: number;
        inProgress: number;
        done: number;
    }>;
}
