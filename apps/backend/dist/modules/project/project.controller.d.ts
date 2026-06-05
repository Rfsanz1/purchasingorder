import { ProjectService } from './project.service.js';
export declare class ProjectController {
    private readonly svc;
    constructor(svc: ProjectService);
    getStats(): Promise<{
        total: number;
        active: number;
        done: number;
        totalTasks: number;
    }>;
    getProjects(q: any): Promise<{
        data: ({
            _count: {
                tasks: number;
            };
        } & {
            status: string;
            budget: import("@prisma/client/runtime/library").Decimal;
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string | null;
            startDate: Date | null;
            endDate: Date | null;
            customerId: string | null;
            managerId: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createProject(dto: any): Promise<{
        status: string;
        budget: import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string | null;
        startDate: Date | null;
        endDate: Date | null;
        customerId: string | null;
        managerId: string | null;
    }>;
    getProject(id: string): Promise<{
        tasks: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tags: string[];
            title: string;
            parentId: string | null;
            deadline: Date | null;
            stage: string;
            priority: number;
            assignedTo: string | null;
            projectId: string;
            milestoneId: string | null;
            plannedHours: import("@prisma/client/runtime/library").Decimal;
            effectiveHours: import("@prisma/client/runtime/library").Decimal;
        }[];
        milestones: {
            id: string;
            name: string;
            createdAt: Date;
            deadline: Date | null;
            projectId: string;
            isDone: boolean;
        }[];
    } & {
        status: string;
        budget: import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string | null;
        startDate: Date | null;
        endDate: Date | null;
        customerId: string | null;
        managerId: string | null;
    }>;
    updateProject(id: string, dto: any): Promise<{
        status: string;
        budget: import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string | null;
        startDate: Date | null;
        endDate: Date | null;
        customerId: string | null;
        managerId: string | null;
    }>;
    deleteProject(id: string): Promise<{
        status: string;
        budget: import("@prisma/client/runtime/library").Decimal;
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string | null;
        startDate: Date | null;
        endDate: Date | null;
        customerId: string | null;
        managerId: string | null;
    }>;
    getTasks(q: any): Promise<{
        data: ({
            project: {
                status: string;
                budget: import("@prisma/client/runtime/library").Decimal;
                id: string;
                name: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                code: string | null;
                startDate: Date | null;
                endDate: Date | null;
                customerId: string | null;
                managerId: string | null;
            };
            milestone: {
                id: string;
                name: string;
                createdAt: Date;
                deadline: Date | null;
                projectId: string;
                isDone: boolean;
            };
            subtasks: {
                id: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                tags: string[];
                title: string;
                parentId: string | null;
                deadline: Date | null;
                stage: string;
                priority: number;
                assignedTo: string | null;
                projectId: string;
                milestoneId: string | null;
                plannedHours: import("@prisma/client/runtime/library").Decimal;
                effectiveHours: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tags: string[];
            title: string;
            parentId: string | null;
            deadline: Date | null;
            stage: string;
            priority: number;
            assignedTo: string | null;
            projectId: string;
            milestoneId: string | null;
            plannedHours: import("@prisma/client/runtime/library").Decimal;
            effectiveHours: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
    }>;
    createTask(dto: any): Promise<{
        project: {
            status: string;
            budget: import("@prisma/client/runtime/library").Decimal;
            id: string;
            name: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string | null;
            startDate: Date | null;
            endDate: Date | null;
            customerId: string | null;
            managerId: string | null;
        };
    } & {
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tags: string[];
        title: string;
        parentId: string | null;
        deadline: Date | null;
        stage: string;
        priority: number;
        assignedTo: string | null;
        projectId: string;
        milestoneId: string | null;
        plannedHours: import("@prisma/client/runtime/library").Decimal;
        effectiveHours: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateTask(id: string, dto: any): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tags: string[];
        title: string;
        parentId: string | null;
        deadline: Date | null;
        stage: string;
        priority: number;
        assignedTo: string | null;
        projectId: string;
        milestoneId: string | null;
        plannedHours: import("@prisma/client/runtime/library").Decimal;
        effectiveHours: import("@prisma/client/runtime/library").Decimal;
    }>;
    deleteTask(id: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        tags: string[];
        title: string;
        parentId: string | null;
        deadline: Date | null;
        stage: string;
        priority: number;
        assignedTo: string | null;
        projectId: string;
        milestoneId: string | null;
        plannedHours: import("@prisma/client/runtime/library").Decimal;
        effectiveHours: import("@prisma/client/runtime/library").Decimal;
    }>;
    getMilestones(id: string): Promise<({
        tasks: {
            id: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            tags: string[];
            title: string;
            parentId: string | null;
            deadline: Date | null;
            stage: string;
            priority: number;
            assignedTo: string | null;
            projectId: string;
            milestoneId: string | null;
            plannedHours: import("@prisma/client/runtime/library").Decimal;
            effectiveHours: import("@prisma/client/runtime/library").Decimal;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        deadline: Date | null;
        projectId: string;
        isDone: boolean;
    })[]>;
    createMilestone(dto: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        deadline: Date | null;
        projectId: string;
        isDone: boolean;
    }>;
    getTimesheets(q: any): Promise<{
        data: ({
            task: {
                project: {
                    status: string;
                    budget: import("@prisma/client/runtime/library").Decimal;
                    id: string;
                    name: string;
                    active: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    code: string | null;
                    startDate: Date | null;
                    endDate: Date | null;
                    customerId: string | null;
                    managerId: string | null;
                };
            } & {
                id: string;
                active: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                tags: string[];
                title: string;
                parentId: string | null;
                deadline: Date | null;
                stage: string;
                priority: number;
                assignedTo: string | null;
                projectId: string;
                milestoneId: string | null;
                plannedHours: import("@prisma/client/runtime/library").Decimal;
                effectiveHours: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id: string;
            createdAt: Date;
            description: string | null;
            date: Date;
            employeeId: string | null;
            taskId: string;
            hours: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
    }>;
    logTimesheet(dto: any): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        date: Date;
        employeeId: string | null;
        taskId: string;
        hours: import("@prisma/client/runtime/library").Decimal;
    }>;
}
