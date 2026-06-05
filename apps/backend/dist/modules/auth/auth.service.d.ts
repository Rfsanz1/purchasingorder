import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    static resolveAppRedirect(role: string): string;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        roles: string[];
        permissions: string[];
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
        id: string;
        email: string;
        name: string | null;
        password: string;
        active: boolean;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            roles: string[];
            permissions: string[];
        };
        appRedirect: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
        data: any;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
        data: {
            token: string;
            expiresAt: Date;
        };
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
        data: any;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
        data: any;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
