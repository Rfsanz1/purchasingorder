import { FleetService } from './fleet.service.js';
export declare class FleetController {
    private readonly svc;
    constructor(svc: FleetService);
    getStats(): Promise<{
        total: number;
        active: number;
        needService: number;
        totalServiceCost: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getVehicles(q: any): Promise<({
        _count: {
            services: number;
        };
    } & {
        id: string;
        active: boolean;
        createdAt: Date;
        brand: string;
        year: number | null;
        fuelType: string;
        licensePlate: string;
        model: string;
        driverId: string | null;
        currentOdometer: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    createVehicle(dto: any): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        brand: string;
        year: number | null;
        fuelType: string;
        licensePlate: string;
        model: string;
        driverId: string | null;
        currentOdometer: import("@prisma/client/runtime/library").Decimal;
    }>;
    getVehicle(id: string): Promise<{
        services: {
            id: string;
            createdAt: Date;
            type: string;
            notes: string | null;
            date: Date;
            vehicleId: string;
            vendor: string | null;
            odometer: import("@prisma/client/runtime/library").Decimal | null;
            cost: import("@prisma/client/runtime/library").Decimal;
            nextService: Date | null;
        }[];
    } & {
        id: string;
        active: boolean;
        createdAt: Date;
        brand: string;
        year: number | null;
        fuelType: string;
        licensePlate: string;
        model: string;
        driverId: string | null;
        currentOdometer: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateVehicle(id: string, dto: any): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        brand: string;
        year: number | null;
        fuelType: string;
        licensePlate: string;
        model: string;
        driverId: string | null;
        currentOdometer: import("@prisma/client/runtime/library").Decimal;
    }>;
    deactivateVehicle(id: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        brand: string;
        year: number | null;
        fuelType: string;
        licensePlate: string;
        model: string;
        driverId: string | null;
        currentOdometer: import("@prisma/client/runtime/library").Decimal;
    }>;
    getServices(q: any): Promise<{
        data: ({
            vehicle: {
                id: string;
                active: boolean;
                createdAt: Date;
                brand: string;
                year: number | null;
                fuelType: string;
                licensePlate: string;
                model: string;
                driverId: string | null;
                currentOdometer: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            type: string;
            notes: string | null;
            date: Date;
            vehicleId: string;
            vendor: string | null;
            odometer: import("@prisma/client/runtime/library").Decimal | null;
            cost: import("@prisma/client/runtime/library").Decimal;
            nextService: Date | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createService(dto: any): Promise<{
        vehicle: {
            id: string;
            active: boolean;
            createdAt: Date;
            brand: string;
            year: number | null;
            fuelType: string;
            licensePlate: string;
            model: string;
            driverId: string | null;
            currentOdometer: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        createdAt: Date;
        type: string;
        notes: string | null;
        date: Date;
        vehicleId: string;
        vendor: string | null;
        odometer: import("@prisma/client/runtime/library").Decimal | null;
        cost: import("@prisma/client/runtime/library").Decimal;
        nextService: Date | null;
    }>;
    getMyDeliveryTasks(req: any): Promise<any>;
    getDeliveryTask(id: string): Promise<{
        id: string;
        soNumber: string;
        customerName: any;
        phone: any;
        address: any;
        notes: any;
        status: string;
        items: any;
    }>;
    updateDeliveryStatus(id: string, dto: any, req: any): Promise<{
        success: boolean;
        id: string;
        status: any;
    }>;
    getDeliveryHistory(q: any, req: any): Promise<any>;
}
