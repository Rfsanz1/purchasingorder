import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module.js';
import { UserModule } from './modules/user/user.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { RoleModule } from './modules/role/role.module.js';
import { NotificationModule } from './modules/notification/notification.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { PrismaService } from './database/prisma.service.js';
import { LegacyBridgeService } from './legacy/legacy-bridge.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    UserModule,
    RoleModule,
    NotificationModule,
    DashboardModule,
  ],
  providers: [PrismaService, LegacyBridgeService],
})
export class AppModule {}
