import { UserService } from './user.service.js';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: any): Promise<{
        id: string;
        name: string;
        email: string;
        roles: string[];
        permissions: string[];
    }>;
    listUsers(): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        roleId: string;
        active: boolean;
        createdAt: Date;
    }[]>;
    createUser(body: {
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
    updateUser(id: string, body: {
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
    deleteUser(id: string): Promise<{
        success: boolean;
    }>;
}
