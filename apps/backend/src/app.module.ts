import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/user/user.module.js';
import { RoleModule } from './modules/role/role.module.js';
import { NotificationModule } from './modules/notification/notification.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { InventoryModule } from './modules/inventory/inventory.module.js';
import { SalesModule } from './modules/sales/sales.module.js';
import { PurchasingModule } from './modules/purchasing/purchasing.module.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { HrModule } from './modules/hr/hr.module.js';
import { FinanceModule } from './modules/finance/finance.module.js';
import { KledoModule } from './modules/kledo/kledo.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { DriverAreasModule } from './modules/driver-areas/driver-areas.module.js';
import { PosModule } from './modules/pos/pos.module.js';
import { PrismaService } from './database/prisma.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    HealthModule,
    AuthModule,
    UserModule,
    RoleModule,
    NotificationModule,
    DashboardModule,
    InventoryModule,
    SalesModule,
    PurchasingModule,
    CustomersModule,
    HrModule,
    FinanceModule,
    KledoModule,
    SettingsModule,
    DriverAreasModule,
    PosModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
