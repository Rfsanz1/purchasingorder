import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class FleetService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getVehicles(query: any) {
    const { search, active = 'true', fuelType } = query;
    const where: any = { active: active !== 'false' };
    if (search) where.OR = [{ licensePlate: { contains: search, mode: 'insensitive' } }, { brand: { contains: search, mode: 'insensitive' } }];
    if (fuelType) where.fuelType = fuelType;
    return this.prisma.vehicle.findMany({ where, include: { _count: { select: { services: true } } }, orderBy: { licensePlate: 'asc' } });
  }

  async getVehicle(id: string) {
    const v = await this.prisma.vehicle.findUnique({ where: { id }, include: { services: { orderBy: { date: 'desc' }, take: 10 } } });
    if (!v) throw new NotFoundException('Kendaraan tidak ditemukan');
    return v;
  }

  async createVehicle(dto: any) { return this.prisma.vehicle.create({ data: dto }); }
  async updateVehicle(id: string, dto: any) { return this.prisma.vehicle.update({ where: { id }, data: dto }); }
  async deactivateVehicle(id: string) { return this.prisma.vehicle.update({ where: { id }, data: { active: false } }); }

  async getServices(query: any) {
    const { vehicleId, type, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (type) where.type = type;
    const [data, total] = await Promise.all([
      this.prisma.vehicleService.findMany({ where, skip, take: Number(limit), include: { vehicle: true }, orderBy: { date: 'desc' } }),
      this.prisma.vehicleService.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createService(dto: any) { return this.prisma.vehicleService.create({ data: dto, include: { vehicle: true } }); }

  async getStats() {
    const [total, active] = await Promise.all([
      this.prisma.vehicle.count(),
      this.prisma.vehicle.count({ where: { active: true } }),
    ]);
    const overdueServices = await this.prisma.vehicleService.findMany({
      where: { nextService: { lte: new Date() } },
      select: { vehicleId: true },
      distinct: ['vehicleId'],
    });
    const totalCost = await this.prisma.vehicleService.aggregate({ _sum: { cost: true } });
    return { total, active, needService: overdueServices.length, totalServiceCost: totalCost._sum.cost ?? 0 };
  }
}
