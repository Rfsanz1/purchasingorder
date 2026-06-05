import ExcelJS from 'exceljs';
export declare function productsToExcelBuffer(products: any[]): Promise<Buffer<ExcelJS.Buffer>>;
export declare function stockOpnameToExcelBuffer(opname: any): Promise<Buffer<ExcelJS.Buffer>>;
export declare function excelBufferToStockOpnameItems(buffer: Buffer): Promise<any[]>;
export declare function excelBufferToProducts(buffer: Buffer): Promise<any[]>;
