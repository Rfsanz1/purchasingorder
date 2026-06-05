import { PrismaService } from '../../database/prisma.service.js';
export declare class HelpdeskService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateTicketNo;
    getTeams(): Promise<({
        _count: {
            tickets: number;
        };
    } & {
        id: string;
        email: string | null;
        name: string;
        active: boolean;
        createdAt: Date;
        description: string | null;
        slaHours: number;
    })[]>;
    createTeam(dto: any): Promise<{
        id: string;
        email: string | null;
        name: string;
        active: boolean;
        createdAt: Date;
        description: string | null;
        slaHours: number;
    }>;
    getTickets(query: any): Promise<{
        data: ({
            team: {
                id: string;
                email: string | null;
                name: string;
                active: boolean;
                createdAt: Date;
                description: string | null;
                slaHours: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tags: string[];
            customerId: string | null;
            rating: number | null;
            closedAt: Date | null;
            stage: string;
            priority: number;
            teamId: string | null;
            assignedTo: string | null;
            noTicket: string;
            subject: string;
            slaDeadline: Date | null;
            ratingComment: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getTicket(id: string): Promise<{
        team: {
            id: string;
            email: string | null;
            name: string;
            active: boolean;
            createdAt: Date;
            description: string | null;
            slaHours: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tags: string[];
        customerId: string | null;
        rating: number | null;
        closedAt: Date | null;
        stage: string;
        priority: number;
        teamId: string | null;
        assignedTo: string | null;
        noTicket: string;
        subject: string;
        slaDeadline: Date | null;
        ratingComment: string | null;
    }>;
    createTicket(dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tags: string[];
        customerId: string | null;
        rating: number | null;
        closedAt: Date | null;
        stage: string;
        priority: number;
        teamId: string | null;
        assignedTo: string | null;
        noTicket: string;
        subject: string;
        slaDeadline: Date | null;
        ratingComment: string | null;
    }>;
    updateTicket(id: string, dto: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tags: string[];
        customerId: string | null;
        rating: number | null;
        closedAt: Date | null;
        stage: string;
        priority: number;
        teamId: string | null;
        assignedTo: string | null;
        noTicket: string;
        subject: string;
        slaDeadline: Date | null;
        ratingComment: string | null;
    }>;
    closeTicket(id: string, rating?: number, ratingComment?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tags: string[];
        customerId: string | null;
        rating: number | null;
        closedAt: Date | null;
        stage: string;
        priority: number;
        teamId: string | null;
        assignedTo: string | null;
        noTicket: string;
        subject: string;
        slaDeadline: Date | null;
        ratingComment: string | null;
    }>;
    getStats(): Promise<{
        total: number;
        open: number;
        inProgress: number;
        solved: number;
        closed: number;
        urgent: number;
    }>;
}
