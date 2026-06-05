var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller.js';
import { InventoryService } from './inventory.service.js';
import { CostingService } from './costing.service.js';
import { LandedCostService } from './landed-cost.service.js';
import { ValuationService } from './valuation.service.js';
import { PrismaService } from '../../database/prisma.service.js';
import { SettingsModule } from '../settings/settings.module.js';
import { FinanceModule } from '../finance/finance.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { ReorderCronService } from './reorder-cron.service.js';
let InventoryModule = class InventoryModule {
};
InventoryModule = __decorate([
    Module({
        imports: [SettingsModule, FinanceModule, ScheduleModule.forRoot()],
        controllers: [InventoryController],
        providers: [InventoryService, CostingService, LandedCostService, ValuationService, PrismaService, ReorderCronService],
        exports: [InventoryService, CostingService, LandedCostService, ValuationService],
    })
], InventoryModule);
export { InventoryModule };
