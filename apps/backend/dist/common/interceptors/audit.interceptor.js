var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs';
import { PrismaService } from '../../database/prisma.service.js';
const AUDIT_MODULES = ['finance', 'inventory', 'sales', 'purchasing', 'payroll', 'assets', 'accounting', 'tax'];
let AuditInterceptor = class AuditInterceptor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method))
            return next.handle();
        const url = req.url ?? '';
        const isAuditTarget = AUDIT_MODULES.some(m => url.includes(`/api/${m}`));
        if (!isAuditTarget)
            return next.handle();
        const user = req.user;
        const actorId = user?.id ?? user?.sub ?? null;
        const ipAddress = String(req.ip ?? req.headers['x-forwarded-for'] ?? '').slice(0, 100);
        const userAgent = String(req.headers['user-agent'] ?? '').slice(0, 250);
        const branchId = req.headers['x-branch-id'] ?? undefined;
        const segments = url.replace('/api/', '').split('?')[0].split('/').filter(Boolean);
        const resource = segments[0] ?? url;
        const action = method === 'POST' ? 'CREATE' : method === 'DELETE' ? 'DELETE' : 'UPDATE';
        return next.handle().pipe(tap(async (result) => {
            try {
                await this.prisma.auditLog.create({
                    data: {
                        actorId,
                        action,
                        resource,
                        tableName: segments[0] ?? null,
                        recordId: segments[1] ?? null,
                        newData: result && typeof result === 'object' ? result : null,
                        ipAddress,
                        userAgent,
                        branchId: branchId ?? null,
                        metadata: { method, url: url.slice(0, 200) },
                    },
                });
            }
            catch { /* audit failure tidak boleh break operation utama */ }
        }));
    }
};
AuditInterceptor = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AuditInterceptor);
export { AuditInterceptor };
