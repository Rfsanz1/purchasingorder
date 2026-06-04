import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class HrService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getEmployees(query: any) {
    const { search, departemen, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (departemen) where.departemen = departemen;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({ where, skip, take: Number(limit), orderBy: { name: 'asc' } }),
      this.prisma.employee.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async getEmployee(id: string) {
    const e = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        payrolls: { take: 12, orderBy: { createdAt: 'desc' } },
        attendances: { take: 30, orderBy: { tanggal: 'desc' } },
      },
    });
    if (!e) throw new NotFoundException('Karyawan tidak ditemukan');
    return e;
  }

  async createEmployee(dto: any) { return this.prisma.employee.create({ data: dto }); }
  async updateEmployee(id: string, dto: any) { return this.prisma.employee.update({ where: { id }, data: dto }); }
  async deleteEmployee(id: string) { return this.prisma.employee.update({ where: { id }, data: { status: 'nonaktif' } }); }

  async getPayrolls(query: any) {
    const { employeeId, status, periode, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (periode) where.periode = { contains: periode };
    const [data, total] = await Promise.all([
      this.prisma.payroll.findMany({ where, skip, take: Number(limit), include: { employee: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.payroll.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createPayroll(dto: any) {
    const { gapok, tunjangan = 0, potongan = 0, ...rest } = dto;
    const netto = Number(gapok) + Number(tunjangan) - Number(potongan);
    return this.prisma.payroll.create({ data: { ...rest, gapok: Number(gapok), tunjangan: Number(tunjangan), potongan: Number(potongan), netto } });
  }

  async updatePayroll(id: string, dto: any) { return this.prisma.payroll.update({ where: { id }, data: dto }); }

  async getAttendances(query: any) {
    const { employeeId, tanggal, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (tanggal) where.tanggal = { gte: new Date(tanggal) };
    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({ where, skip, take: Number(limit), include: { employee: true }, orderBy: { tanggal: 'desc' } }),
      this.prisma.attendance.count({ where }),
    ]);
    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async createAttendance(dto: any) { return this.prisma.attendance.create({ data: dto }); }

  async getStats() {
    const [total, aktif, cuti] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { status: 'aktif' } }),
      this.prisma.employee.count({ where: { status: 'cuti' } }),
    ]);
    const totalGaji = await this.prisma.payroll.aggregate({ _sum: { netto: true }, where: { status: 'confirmed' } });
    return { total, aktif, cuti, nonaktif: total - aktif - cuti, totalGaji: totalGaji._sum.netto ?? 0 };
  }

  async getContracts(query: any) {
    const { employeeId, status, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.employeeContract.findMany({ where, skip, take: Number(limit), include: { employee: { select: { id: true, name: true, nik: true } } }, orderBy: { startDate: 'desc' } }),
      this.prisma.employeeContract.count({ where }),
    ]);
    return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async getContract(id: string) {
    const data = await this.prisma.employeeContract.findUnique({ where: { id }, include: { employee: true } });
    if (!data) throw new NotFoundException('Kontrak tidak ditemukan');
    return { data, message: 'success' };
  }

  async createContract(dto: any) {
    if (!dto.employeeId) throw new BadRequestException('employeeId harus diisi');
    if (!dto.startDate) throw new BadRequestException('startDate harus diisi');
    const data = await this.prisma.employeeContract.create({ data: dto });
    return { data, message: 'Kontrak berhasil dibuat' };
  }

  async updateContract(id: string, dto: any) {
    await this.getContract(id);
    const data = await this.prisma.employeeContract.update({ where: { id }, data: dto });
    return { data, message: 'Kontrak berhasil diupdate' };
  }

  async deleteContract(id: string) {
    await this.prisma.employeeContract.delete({ where: { id } });
    return { data: null, message: 'Kontrak berhasil dihapus' };
  }

  async getShifts(query: any) {
    const data = await this.prisma.workShift.findMany({ orderBy: { nama: 'asc' } });
    return { data, message: 'success' };
  }

  async createShift(dto: any) {
    if (!dto.nama) throw new BadRequestException('Nama shift harus diisi');
    const data = await this.prisma.workShift.create({ data: dto });
    return { data, message: 'Shift berhasil dibuat' };
  }

  async updateShift(id: string, dto: any) {
    const data = await this.prisma.workShift.update({ where: { id }, data: dto });
    return { data, message: 'Shift berhasil diupdate' };
  }

  async deleteShift(id: string) {
    await this.prisma.workShift.delete({ where: { id } });
    return { data: null, message: 'Shift berhasil dihapus' };
  }

  async getMutasi(query: any) {
    const { employeeId, page = 1, limit = 20 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    const [data, total] = await Promise.all([
      this.prisma.employeeMutasi.findMany({ where, skip, take: Number(limit), include: { employee: { select: { id: true, name: true, nik: true } } }, orderBy: { effectiveDate: 'desc' } }),
      this.prisma.employeeMutasi.count({ where }),
    ]);
    return { data, message: 'success', meta: { total, page: Number(page), limit: Number(limit) } };
  }

  async createMutasi(dto: any) {
    if (!dto.employeeId) throw new BadRequestException('employeeId harus diisi');
    if (!dto.effectiveDate) throw new BadRequestException('effectiveDate harus diisi');
    const data = await this.prisma.employeeMutasi.create({ data: dto });
    return { data, message: 'Mutasi/transfer berhasil dicatat' };
  }

  async getEmployeeHistory(employeeId: string) {
    const [employee, contracts, mutasi, attendances, payrolls] = await Promise.all([
      this.prisma.employee.findUnique({ where: { id: employeeId } }),
      this.prisma.employeeContract.findMany({ where: { employeeId }, orderBy: { startDate: 'desc' } }),
      this.prisma.employeeMutasi.findMany({ where: { employeeId }, orderBy: { effectiveDate: 'desc' } }),
      this.prisma.attendance.findMany({ where: { employeeId }, orderBy: { tanggal: 'desc' }, take: 30 }),
      this.prisma.payroll.findMany({ where: { employeeId }, orderBy: { createdAt: 'desc' }, take: 12 }),
    ]);
    if (!employee) throw new NotFoundException('Karyawan tidak ditemukan');
    return { data: { employee, contracts, mutasi, attendances, payrolls }, message: 'success' };
  }

  async importCsv(rows: any[]) {
    if (!Array.isArray(rows) || rows.length === 0) throw new BadRequestException('Data CSV tidak valid atau kosong');
    const results: any[] = [];
    for (const row of rows) {
      try {
        const name = row.name ?? row.nama;
        const emp = await this.prisma.employee.upsert({
          where: { nik: row.nik },
          update: { name, jabatan: row.jabatan, departemen: row.departemen, status: row.status ?? 'aktif' },
          create: { nik: row.nik, name, jabatan: row.jabatan, departemen: row.departemen, status: row.status ?? 'aktif' },
        });
        results.push({ nik: row.nik, status: 'ok', id: emp.id });
      } catch (e: any) {
        results.push({ nik: row.nik, status: 'error', message: e.message });
      }
    }
    const success = results.filter(r => r.status === 'ok').length;
    return { data: results, message: `Import selesai: ${success}/${rows.length} berhasil` };
  }
}
