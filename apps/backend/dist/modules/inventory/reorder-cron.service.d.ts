import { PrismaService } from '../../database/prisma.service.js';
export declare class ReorderCronService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    handleReorder(): Promise<void>;
}
