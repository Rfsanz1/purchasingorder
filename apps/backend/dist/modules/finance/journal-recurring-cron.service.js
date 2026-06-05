var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JournalRecurringCronService_1;
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JournalRecurringService } from './journal-recurring.service.js';
let JournalRecurringCronService = JournalRecurringCronService_1 = class JournalRecurringCronService {
    recurringService;
    logger = new Logger(JournalRecurringCronService_1.name);
    constructor(recurringService) {
        this.recurringService = recurringService;
    }
    async handleCron() {
        this.logger.debug('Menjalankan recurring journal harian');
        try {
            await this.recurringService.runDueRecurring();
        }
        catch (error) {
            this.logger.error('Recurring journal cron gagal', error);
        }
    }
};
__decorate([
    Cron(CronExpression.EVERY_DAY_AT_1AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], JournalRecurringCronService.prototype, "handleCron", null);
JournalRecurringCronService = JournalRecurringCronService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JournalRecurringService])
], JournalRecurringCronService);
export { JournalRecurringCronService };
