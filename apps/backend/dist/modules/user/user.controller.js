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
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, UseGuards, } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { UserService } from './user.service.js';
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(user) {
        return this.userService.getCurrentUser(user.userId || user.sub || user.id);
    }
    async listUsers() {
        return this.userService.findAll();
    }
    async createUser(body) {
        return this.userService.create(body);
    }
    async updateUser(id, body) {
        return this.userService.update(id, body);
    }
    async toggleActive(id) {
        return this.userService.toggleActive(id);
    }
    async deleteUser(id) {
        return this.userService.remove(id);
    }
};
__decorate([
    Get('me'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    Get(),
    UseGuards(RolesGuard),
    Roles('admin', 'Super Admin', 'Owner'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listUsers", null);
__decorate([
    Post(),
    UseGuards(RolesGuard),
    Roles('admin', 'Super Admin', 'Owner'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    Put(':id'),
    UseGuards(RolesGuard),
    Roles('admin', 'Super Admin', 'Owner'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    Patch(':id/toggle-active'),
    UseGuards(RolesGuard),
    Roles('admin', 'Super Admin', 'Owner'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "toggleActive", null);
__decorate([
    Delete(':id'),
    UseGuards(RolesGuard),
    Roles('admin', 'Super Admin', 'Owner'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
UserController = __decorate([
    Controller('users'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(UserService)),
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
