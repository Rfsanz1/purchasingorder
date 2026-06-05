import { PrismaService } from '../../database/prisma.service.js';
export declare class RoleService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        data: ({
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
        })[];
        message: string;
    }>;
    findPermissions(): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
        }[];
        message: string;
    }>;
    findOne(id: string): Promise<{
        data: {
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
            users: {
                id: string;
                email: string;
                name: string;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
        };
        message: string;
    }>;
    create(dto: {
        name: string;
        description?: string;
    }): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
        };
        message: string;
    }>;
    update(id: string, dto: {
        name?: string;
        description?: string;
    }): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
        };
        message: string;
    }>;
    remove(id: string): Promise<{
        data: any;
        message: string;
    }>;
    assignPermissions(roleId: string, permissionIds: string[]): Promise<{
        data: {
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
        message: string;
    }>;
}
