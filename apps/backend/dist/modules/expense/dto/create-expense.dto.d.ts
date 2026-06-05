export declare class CreateExpenseDto {
    id?: string;
    number?: string;
    date: string;
    contactId?: string;
    accountId: string;
    paymentAccountId?: string;
    amount: number;
    taxId?: string;
    taxAmount?: number;
    totalAmount: number;
    description?: string;
    attachment?: string;
    tags?: string[];
    branchId?: string;
    createdBy: string;
}
