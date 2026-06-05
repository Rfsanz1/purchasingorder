import { RoleService } from './role.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { AssignPermissionsDto } from './dto/assign-permissions.dto.js';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    getRoles(): Promise<{
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
    getPermissions(): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
        }[];
        message: string;
    }>;
    getRole(id: string): Promise<{
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
    createRole(dto: CreateRoleDto): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
        };
        message: string;
    }>;
    updateRole(id: string, dto: CreateRoleDto): Promise<{
        data: {
            id: string;
            name: string;
            description: string | null;
        };
        message: string;
    }>;
    deleteRole(id: string): Promise<{
        data: any;
        message: string;
    }>;
    assignPermissions(id: string, dto: AssignPermissionsDto): Promise<{
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
