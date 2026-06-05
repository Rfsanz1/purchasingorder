import { PrismaService } from '../../database/prisma.service.js';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCurrentUser(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        roles: string[];
        permissions: string[];
    }>;
    findByEmail(email: string): Promise<{
        role: {
            permissions: ({
                permission: {
                    id: string;
                    name: string;
                    description: string | null;
                };
            } & {
                roleId: string;
                permissionId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        email: string;
        name: string | null;
        password: string;
        active: boolean;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        roleId: string;
        active: boolean;
        createdAt: Date;
    }[]>;
    create(dto: {
        name: string;
        email: string;
        password: string;
        roleId: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        roleId: string;
        active: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: {
        name?: string;
        email?: string;
        password?: string;
        roleId?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        roleId: string;
        active: boolean;
        createdAt: Date;
    }>;
    toggleActive(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        roleId: string;
        active: boolean;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
