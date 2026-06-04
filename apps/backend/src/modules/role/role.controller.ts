import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { AssignPermissionsDto } from './dto/assign-permissions.dto.js';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super admin')
export class RoleController {
  constructor(@Inject(RoleService) private readonly roleService: RoleService) {}

  @Get()
  getRoles() { return this.roleService.findAll(); }

  @Get('permissions')
  getPermissions() { return this.roleService.findPermissions(); }

  @Get(':id')
  getRole(@Param('id') id: string) { return this.roleService.findOne(id); }

  @Post()
  createRole(@Body() dto: CreateRoleDto) { return this.roleService.create(dto); }

  @Put(':id')
  updateRole(@Param('id') id: string, @Body() dto: CreateRoleDto) { return this.roleService.update(id, dto); }

  @Delete(':id')
  deleteRole(@Param('id') id: string) { return this.roleService.remove(id); }

  @Post(':id/assign-permissions')
  assignPermissions(@Param('id') id: string, @Body() dto: AssignPermissionsDto) {
    return this.roleService.assignPermissions(id, dto.permissionIds);
  }
}
