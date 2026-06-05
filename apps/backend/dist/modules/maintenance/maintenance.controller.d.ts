import { MaintenanceService } from './maintenance.service.js';
export declare class MaintenanceController {
    private readonly svc;
    constructor(svc: MaintenanceService);
    getStats(): Promise<{
        total: number;
        open: number;
        inProgress: number;
        done: number;
        overdue: number;
    }>;
    getEquipment(q: any): Promise<({
        _count: {
            requests: number;
        };
    } & {
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        category: string | null;
        serialNo: string | null;
        location: string | null;
        technicianId: string | null;
        purchaseDate: Date | null;
        warrantyDate: Date | null;
        nextMaintenance: Date | null;
    })[]>;
    createEquipment(dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        category: string | null;
        serialNo: string | null;
        location: string | null;
        technicianId: string | null;
        purchaseDate: Date | null;
        warrantyDate: Date | null;
        nextMaintenance: Date | null;
    }>;
    updateEquipment(id: string, dto: any): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        category: string | null;
        serialNo: string | null;
        location: string | null;
        technicianId: string | null;
        purchaseDate: Date | null;
        warrantyDate: Date | null;
        nextMaintenance: Date | null;
    }>;
    deactivateEquipment(id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        category: string | null;
        serialNo: string | null;
        location: string | null;
        technicianId: string | null;
        purchaseDate: Date | null;
        warrantyDate: Date | null;
        nextMaintenance: Date | null;
    }>;
    getRequests(q: any): Promise<{
        data: ({
            equipment: {
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                category: string | null;
                serialNo: string | null;
                location: string | null;
                technicianId: string | null;
                purchaseDate: Date | null;
                warrantyDate: Date | null;
                nextMaintenance: Date | null;
            };
        } & {
            status: string;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            notes: string | null;
            priority: number;
            scheduledDate: Date | null;
            technicianId: string | null;
            equipmentId: string;
            noMr: string;
            requestDate: Date;
            closedDate: Date | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createRequest(dto: any): Promise<{
        equipment: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            category: string | null;
            serialNo: string | null;
            location: string | null;
            technicianId: string | null;
            purchaseDate: Date | null;
            warrantyDate: Date | null;
            nextMaintenance: Date | null;
        };
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        priority: number;
        scheduledDate: Date | null;
        technicianId: string | null;
        equipmentId: string;
        noMr: string;
        requestDate: Date;
        closedDate: Date | null;
    }>;
    getRequest(id: string): Promise<{
        equipment: {
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            category: string | null;
            serialNo: string | null;
            location: string | null;
            technicianId: string | null;
            purchaseDate: Date | null;
            warrantyDate: Date | null;
            nextMaintenance: Date | null;
        };
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        priority: number;
        scheduledDate: Date | null;
        technicianId: string | null;
        equipmentId: string;
        noMr: string;
        requestDate: Date;
        closedDate: Date | null;
    }>;
    updateRequest(id: string, dto: any): Promise<{
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        priority: number;
        scheduledDate: Date | null;
        technicianId: string | null;
        equipmentId: string;
        noMr: string;
        requestDate: Date;
        closedDate: Date | null;
    }>;
    closeRequest(id: string): Promise<{
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        notes: string | null;
        priority: number;
        scheduledDate: Date | null;
        technicianId: string | null;
        equipmentId: string;
        noMr: string;
        requestDate: Date;
        closedDate: Date | null;
    }>;
}
