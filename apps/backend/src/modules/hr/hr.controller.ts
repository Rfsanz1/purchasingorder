import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('hr')
@UseGuards(JwtAuthGuard)
export class HrController {
  constructor(@Inject(HrService) private readonly svc: HrService) {}

  @Get('stats')              getStats()                                                     { return this.svc.getStats(); }

  @Get('employees')          getEmployees(@Query() q: any)                                  { return this.svc.getEmployees(q); }
  @Get('employees/:id')      getEmployee(@Param('id') id: string)                           { return this.svc.getEmployee(id); }
  @Post('employees')         createEmployee(@Body() dto: any)                               { return this.svc.createEmployee(dto); }
  @Put('employees/:id')      updateEmployee(@Param('id') id: string, @Body() dto: any)     { return this.svc.updateEmployee(id, dto); }
  @Delete('employees/:id')   deleteEmployee(@Param('id') id: string)                       { return this.svc.deleteEmployee(id); }
  @Get('employees/:id/history') getEmployeeHistory(@Param('id') id: string)                { return this.svc.getEmployeeHistory(id); }

  @Get('payrolls')           getPayrolls(@Query() q: any)                                  { return this.svc.getPayrolls(q); }
  @Post('payrolls')          createPayroll(@Body() dto: any)                               { return this.svc.createPayroll(dto); }
  @Put('payrolls/:id')       updatePayroll(@Param('id') id: string, @Body() dto: any)     { return this.svc.updatePayroll(id, dto); }

  @Get('attendances')        getAttendances(@Query() q: any)                               { return this.svc.getAttendances(q); }
  @Post('attendances')       createAttendance(@Body() dto: any)                            { return this.svc.createAttendance(dto); }

  @Get('contracts')          getContracts(@Query() q: any)                                 { return this.svc.getContracts(q); }
  @Get('contracts/:id')      getContract(@Param('id') id: string)                          { return this.svc.getContract(id); }
  @Post('contracts')         createContract(@Body() dto: any)                              { return this.svc.createContract(dto); }
  @Put('contracts/:id')      updateContract(@Param('id') id: string, @Body() dto: any)    { return this.svc.updateContract(id, dto); }
  @Delete('contracts/:id')   deleteContract(@Param('id') id: string)                      { return this.svc.deleteContract(id); }

  @Get('shifts')             getShifts(@Query() q: any)                                    { return this.svc.getShifts(q); }
  @Post('shifts')            createShift(@Body() dto: any)                                 { return this.svc.createShift(dto); }
  @Put('shifts/:id')         updateShift(@Param('id') id: string, @Body() dto: any)       { return this.svc.updateShift(id, dto); }
  @Delete('shifts/:id')      deleteShift(@Param('id') id: string)                         { return this.svc.deleteShift(id); }

  @Get('mutasi')             getMutasi(@Query() q: any)                                    { return this.svc.getMutasi(q); }
  @Post('mutasi')            createMutasi(@Body() dto: any)                               { return this.svc.createMutasi(dto); }

  @Post('import-csv')        importCsv(@Body() dto: { rows: any[] })                      { return this.svc.importCsv(dto.rows); }
}
