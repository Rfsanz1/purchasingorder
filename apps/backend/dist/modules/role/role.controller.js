var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { AssignPermissionsDto } from './dto/assign-permissions.dto.js';
let RoleController = class RoleController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    getRoles() { return this.roleService.findAll(); }
    getPermissions() { return this.roleService.findPermissions(); }
    getRole(id) { return this.roleService.findOne(id); }
    createRole(dto) { return this.roleService.create(dto); }
    updateRole(id, dto) { return this.roleService.update(id, dto); }
    deleteRole(id) { return this.roleService.remove(id); }
    assignPermissions(id, dto) {
        return this.roleService.assignPermissions(id, dto.permissionIds);
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "getRoles", null);
__decorate([
    Get('permissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "getPermissions", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "getRole", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRoleDto]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "createRole", null);
__decorate([
    Put(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateRoleDto]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "updateRole", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "deleteRole", null);
__decorate([
    Post(':id/assign-permissions'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AssignPermissionsDto]),
    __metadata("design:returntype", void 0)
], RoleController.prototype, "assignPermissions", null);
RoleController = __decorate([
    Controller('roles'),
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('admin', 'super admin'),
    __param(0, Inject(RoleService)),
    __metadata("design:paramtypes", [RoleService])
], RoleController);
export { RoleController };
