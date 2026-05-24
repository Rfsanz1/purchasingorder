import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { FleetService } from './fleet.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('fleet')
@UseGuards(JwtAuthGuard)
export class FleetController {
  constructor(@Inject(FleetService) private readonly svc: FleetService) {}

  @Get('stats') getStats() { return this.svc.getStats(); }
  @Get('vehicles') getVehicles(@Query() q: any) { return this.svc.getVehicles(q); }
  @Post('vehicles') createVehicle(@Body() dto: any) { return this.svc.createVehicle(dto); }
  @Get('vehicles/:id') getVehicle(@Param('id') id: string) { return this.svc.getVehicle(id); }
  @Put('vehicles/:id') updateVehicle(@Param('id') id: string, @Body() dto: any) { return this.svc.updateVehicle(id, dto); }
  @Delete('vehicles/:id') deactivateVehicle(@Param('id') id: string) { return this.svc.deactivateVehicle(id); }
  @Get('services') getServices(@Query() q: any) { return this.svc.getServices(q); }
  @Post('services') createService(@Body() dto: any) { return this.svc.createService(dto); }
}
