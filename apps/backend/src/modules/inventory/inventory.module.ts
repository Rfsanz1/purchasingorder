import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller.js';
import { InventoryService } from './inventory.service.js';
import { CostingService } from './costing.service.js';
import { LandedCostService } from './landed-cost.service.js';
import { ValuationService } from './valuation.service.js';
import { PrismaService } from '../../database/prisma.service.js';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, CostingService, LandedCostService, ValuationService, PrismaService],
  exports: [InventoryService, CostingService, LandedCostService, ValuationService],
})
export class InventoryModule {}
