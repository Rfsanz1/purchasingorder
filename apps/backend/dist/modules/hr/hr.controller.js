var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
let HrController = class HrController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    // ─── STATS & GENERAL ─────────────────────────────────────────────────────
    getStats() { return this.svc.getStats(); }
    // ─── EMPLOYEES ───────────────────────────────────────────────────────────
    getEmployees(q) { return this.svc.getEmployees(q); }
    getEmployee(id) { return this.svc.getEmployee(id); }
    createEmployee(dto) { return this.svc.createEmployee(dto); }
    updateEmployee(id, dto) { return this.svc.updateEmployee(id, dto); }
    deleteEmployee(id) { return this.svc.deleteEmployee(id); }
    getEmployeeHistory(id) { return this.svc.getEmployeeHistory(id); }
    // ─── PAYROLLS ────────────────────────────────────────────────────────────
    getPayrolls(q) { return this.svc.getPayrolls(q); }
    createPayroll(dto) { return this.svc.createPayroll(dto); }
    updatePayroll(id, dto) { return this.svc.updatePayroll(id, dto); }
    // ─── ATTENDANCES ─────────────────────────────────────────────────────────
    getAttendances(q) { return this.svc.getAttendances(q); }
    createAttendance(dto) { return this.svc.createAttendance(dto); }
    importAttendanceCsv(dto) { return this.svc.importAttendanceCsv(dto.rows); }
    getAttendanceReport(q) {
        const { employeeId, month, year } = q;
        return this.svc.getAttendanceReport(employeeId, Number(month), Number(year));
    }
    getAttendanceSummary(q) {
        const { month, year, departemenId } = q;
        return this.svc.getAttendanceSummary(Number(month), Number(year), departemenId);
    }
    // ─── SHIFTS ──────────────────────────────────────────────────────────────
    getShifts(q) { return this.svc.getShifts(q); }
    createShift(dto) { return this.svc.createShift(dto); }
    updateShift(id, dto) { return this.svc.updateShift(id, dto); }
    deleteShift(id) { return this.svc.deleteShift(id); }
    assignShift(employeeId, dto) {
        return this.svc.assignShift(employeeId, dto.shiftId);
    }
    // ─── MUTASI/TRANSFER ─────────────────────────────────────────────────────
    getMutasi(q) { return this.svc.getMutasi(q); }
    createMutasi(dto) { return this.svc.createMutasi(dto); }
    // ─── LEAVE TYPES ─────────────────────────────────────────────────────────
    getLeaveTypes() { return this.svc.getLeaveTypes(); }
    createLeaveType(dto) { return this.svc.createLeaveType(dto); }
    // ─── LEAVE REQUESTS ──────────────────────────────────────────────────────
    getLeaveRequests(q) {
        const { employeeId, status } = q;
        return this.svc.getLeaveRequests(employeeId, status);
    }
    createLeaveRequest(dto) { return this.svc.createLeaveRequest(dto); }
    approveLeaveRequest(id, dto) {
        return this.svc.approveLeaveRequest(id, dto.approvedBy);
    }
    rejectLeaveRequest(id, dto) {
        return this.svc.rejectLeaveRequest(id, dto.reason);
    }
    // ─── LEAVE ALLOCATIONS ───────────────────────────────────────────────────
    getLeaveAllocations(q) {
        const { employeeId, year } = q;
        return this.svc.getLeaveAllocations(employeeId, year ? Number(year) : undefined);
    }
    createLeaveAllocation(dto) { return this.svc.createLeaveAllocation(dto); }
    // ─── LEAVE BALANCE ───────────────────────────────────────────────────────
    getLeaveBalance(employeeId, year) {
        return this.svc.getLeaveBalance(employeeId, year ? Number(year) : undefined);
    }
    // ─── LEAVE CALENDAR ──────────────────────────────────────────────────────
    getLeaveCalendar(q) {
        const { month, year, departemenId } = q;
        return this.svc.getLeaveCalendar(Number(month), Number(year), departemenId);
    }
    // ─── CONTRACTS ───────────────────────────────────────────────────────────
    getContracts(q) { return this.svc.getContracts(q); }
    getContract(id) { return this.svc.getContract(id); }
    createContract(dto) { return this.svc.createContract(dto); }
    updateContract(id, dto) { return this.svc.updateContract(id, dto); }
    deleteContract(id) { return this.svc.deleteContract(id); }
    getEmployeeContracts(employeeId) { return this.svc.getEmployeeContracts(employeeId); }
    createEmployeeContract(employeeId, dto) {
        return this.svc.createEmployeeContract(employeeId, dto);
    }
    updateEmployeeContract(contractId, dto) {
        return this.svc.updateEmployeeContract(contractId, dto);
    }
    // ─── EMPLOYEE TRANSFER ────────────────────────────────────────────────────
    transferEmployee(employeeId, dto) {
        return this.svc.transferEmployee(employeeId, dto);
    }
    getTransferHistory(employeeId) { return this.svc.getTransferHistory(employeeId); }
    // ─── CSV IMPORT ───────────────────────────────────────────────────────────
    importCsv(dto) { return this.svc.importCsv(dto.rows); }
};
__decorate([
    Get('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getStats", null);
__decorate([
    Get('employees'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getEmployees", null);
__decorate([
    Get('employees/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getEmployee", null);
__decorate([
    Post('employees'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createEmployee", null);
__decorate([
    Put('employees/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "updateEmployee", null);
__decorate([
    Delete('employees/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "deleteEmployee", null);
__decorate([
    Get('employees/:id/history'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getEmployeeHistory", null);
__decorate([
    Get('payrolls'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getPayrolls", null);
__decorate([
    Post('payrolls'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createPayroll", null);
__decorate([
    Put('payrolls/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "updatePayroll", null);
__decorate([
    Get('attendances'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getAttendances", null);
__decorate([
    Post('attendances'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createAttendance", null);
__decorate([
    Post('attendances/import-csv'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "importAttendanceCsv", null);
__decorate([
    Get('attendances/report'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getAttendanceReport", null);
__decorate([
    Get('attendances/summary'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getAttendanceSummary", null);
__decorate([
    Get('shifts'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getShifts", null);
__decorate([
    Post('shifts'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createShift", null);
__decorate([
    Put('shifts/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "updateShift", null);
__decorate([
    Delete('shifts/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "deleteShift", null);
__decorate([
    Post('employees/:id/assign-shift'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "assignShift", null);
__decorate([
    Get('mutasi'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getMutasi", null);
__decorate([
    Post('mutasi'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createMutasi", null);
__decorate([
    Get('leaves/types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getLeaveTypes", null);
__decorate([
    Post('leaves/types'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createLeaveType", null);
__decorate([
    Get('leaves/requests'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getLeaveRequests", null);
__decorate([
    Post('leaves/requests'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createLeaveRequest", null);
__decorate([
    Post('leaves/requests/:id/approve'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "approveLeaveRequest", null);
__decorate([
    Post('leaves/requests/:id/reject'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "rejectLeaveRequest", null);
__decorate([
    Get('leaves/allocations'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getLeaveAllocations", null);
__decorate([
    Post('leaves/allocations'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createLeaveAllocation", null);
__decorate([
    Get('leaves/balance/:employeeId'),
    __param(0, Param('employeeId')),
    __param(1, Query('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getLeaveBalance", null);
__decorate([
    Get('leaves/calendar'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getLeaveCalendar", null);
__decorate([
    Get('contracts'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getContracts", null);
__decorate([
    Get('contracts/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getContract", null);
__decorate([
    Post('contracts'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createContract", null);
__decorate([
    Put('contracts/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "updateContract", null);
__decorate([
    Delete('contracts/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "deleteContract", null);
__decorate([
    Get('employees/:id/contracts'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getEmployeeContracts", null);
__decorate([
    Post('employees/:id/contracts'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "createEmployeeContract", null);
__decorate([
    Put('employees/:id/contracts/:contractId'),
    __param(0, Param('contractId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "updateEmployeeContract", null);
__decorate([
    Post('employees/:id/transfer'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "transferEmployee", null);
__decorate([
    Get('employees/:id/transfer-history'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getTransferHistory", null);
__decorate([
    Post('import-csv'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "importCsv", null);
HrController = __decorate([
    Controller('hr'),
    UseGuards(JwtAuthGuard),
    __param(0, Inject(HrService)),
    __metadata("design:paramtypes", [HrService])
], HrController);
export { HrController };
