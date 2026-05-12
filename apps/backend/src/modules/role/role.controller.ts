import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Permissions } from '../../common/decorators/permissions.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard, RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Permissions('roles.view')
  @Roles('admin')
  async getRoles() {
    return this.roleService.findAll();
  }

  @Get('permissions')
  @Permissions('permissions.view')
  @Roles('admin')
  async getPermissions() {
    return this.roleService.findPermissions();
  }
}
