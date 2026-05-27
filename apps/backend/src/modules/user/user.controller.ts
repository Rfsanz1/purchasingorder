import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { UserService } from './user.service.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.userService.getCurrentUser(user.userId || user.sub || user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'Super Admin', 'Owner')
  async listUsers() {
    return this.userService.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'Super Admin', 'Owner')
  async createUser(
    @Body() body: { name: string; email: string; password: string; roleId: string },
  ) {
    return this.userService.create(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'Super Admin', 'Owner')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { name?: string; email?: string; password?: string; roleId?: string },
  ) {
    return this.userService.update(id, body);
  }

  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles('admin', 'Super Admin', 'Owner')
  async toggleActive(@Param('id') id: string) {
    return this.userService.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'Super Admin', 'Owner')
  async deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
