import { JournalRecurringService } from './journal-recurring.service.js';
export declare class JournalRecurringCronService {
    private readonly recurringService;
    private readonly logger;
    constructor(recurringService: JournalRecurringService);
    handleCron(): Promise<void>;
}
