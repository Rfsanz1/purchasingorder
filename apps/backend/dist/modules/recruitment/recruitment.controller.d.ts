import { RecruitmentService } from './recruitment.service.js';
export declare class RecruitmentController {
    private readonly svc;
    constructor(svc: RecruitmentService);
    getStats(): Promise<{
        totalPositions: number;
        openPositions: number;
        totalApps: number;
        stageCount: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.JobApplicationGroupByOutputType, "stage"[]> & {
            _count: number;
        })[];
    }>;
    getPositions(q: any): Promise<({
        _count: {
            applications: number;
        };
    } & {
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        departmentId: string | null;
        expectedEmployees: number;
    })[]>;
    createPosition(dto: any): Promise<{
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        departmentId: string | null;
        expectedEmployees: number;
    }>;
    updatePosition(id: string, dto: any): Promise<{
        status: string;
        id: string;
        name: string;
        createdAt: Date;
        departmentId: string | null;
        expectedEmployees: number;
    }>;
    getApplications(q: any): Promise<{
        data: ({
            job: {
                status: string;
                id: string;
                name: string;
                createdAt: Date;
                departmentId: string | null;
                expectedEmployees: number;
            };
        } & {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            notes: string | null;
            phone: string | null;
            jobId: string;
            stage: string;
            priority: number;
            applicantName: string;
            cv: string | null;
            interviewDate: Date | null;
            offerDate: Date | null;
            refuseReason: string | null;
        })[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    createApplication(dto: any): Promise<{
        job: {
            status: string;
            id: string;
            name: string;
            createdAt: Date;
            departmentId: string | null;
            expectedEmployees: number;
        };
    } & {
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        phone: string | null;
        jobId: string;
        stage: string;
        priority: number;
        applicantName: string;
        cv: string | null;
        interviewDate: Date | null;
        offerDate: Date | null;
        refuseReason: string | null;
    }>;
    getApplication(id: string): Promise<{
        job: {
            status: string;
            id: string;
            name: string;
            createdAt: Date;
            departmentId: string | null;
            expectedEmployees: number;
        };
    } & {
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        phone: string | null;
        jobId: string;
        stage: string;
        priority: number;
        applicantName: string;
        cv: string | null;
        interviewDate: Date | null;
        offerDate: Date | null;
        refuseReason: string | null;
    }>;
    updateApplication(id: string, dto: any): Promise<{
        job: {
            status: string;
            id: string;
            name: string;
            createdAt: Date;
            departmentId: string | null;
            expectedEmployees: number;
        };
    } & {
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        phone: string | null;
        jobId: string;
        stage: string;
        priority: number;
        applicantName: string;
        cv: string | null;
        interviewDate: Date | null;
        offerDate: Date | null;
        refuseReason: string | null;
    }>;
    advanceStage(id: string, stage: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        phone: string | null;
        jobId: string;
        stage: string;
        priority: number;
        applicantName: string;
        cv: string | null;
        interviewDate: Date | null;
        offerDate: Date | null;
        refuseReason: string | null;
    }>;
    refuseApplication(id: string, reason: string): Promise<{
        id: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        phone: string | null;
        jobId: string;
        stage: string;
        priority: number;
        applicantName: string;
        cv: string | null;
        interviewDate: Date | null;
        offerDate: Date | null;
        refuseReason: string | null;
    }>;
}
