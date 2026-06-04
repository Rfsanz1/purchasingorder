import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
  constructor(@Inject(InvoiceService) private readonly svc: InvoiceService) {}

  @Get('stats')                 getStats()                                                       { return this.svc.getStats(); }
  @Get()                        findAll(@Query() q: any)                                         { return this.svc.findAll(q); }
  @Get(':id')                   findOne(@Param('id') id: string)                                { return this.svc.findOne(id); }
  @Post()                       create(@Body() dto: any)                                         { return this.svc.create(dto); }
  @Put(':id')                   update(@Param('id') id: string, @Body() dto: any)               { return this.svc.update(id, dto); }
  @Delete(':id')                remove(@Param('id') id: string)                                 { return this.svc.delete(id); }

  @Post(':id/send')             send(@Param('id') id: string)                                   { return this.svc.send(id); }

  @Get(':id/payments')          getPayments(@Param('id') id: string)                            { return this.svc.getPayments(id); }
  @Post(':id/payments')         addPayment(@Param('id') id: string, @Body() dto: any)           { return this.svc.addPayment(id, dto); }

  @Get(':id/credit-notes')      getCreditNotes(@Param('id') id: string)                         { return this.svc.getCreditNotes(id); }
  @Post(':id/credit-notes')     issueCreditNote(@Param('id') id: string, @Body() dto: any)      { return this.svc.issueCreditNote(id, dto); }
}
