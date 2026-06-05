var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, ForbiddenException } from '@nestjs/common';
const ROLE_RULES = [
    { pattern: /^\/api\/sales/, roles: ['admin', 'owner', 'super admin', 'sales', 'sales manager'] },
    { pattern: /^\/api\/crm/, roles: ['admin', 'owner', 'super admin', 'sales', 'sales manager'] },
    { pattern: /^\/api\/customers/, roles: ['admin', 'owner', 'super admin', 'sales', 'sales manager', 'kasir'] },
    { pattern: /^\/api\/invoice/, roles: ['admin', 'owner', 'super admin', 'sales', 'sales manager'] },
    { pattern: /^\/api\/reports\/sales/, roles: ['admin', 'owner', 'super admin', 'sales', 'sales manager'] },
    { pattern: /^\/api\/inventory/, roles: ['admin', 'owner', 'super admin', 'staff gudang', 'gudang'] },
    { pattern: /^\/api\/purchasing\/goods-receipts/, roles: ['admin', 'owner', 'super admin', 'staff gudang', 'gudang'] },
    { pattern: /^\/api\/delivery/, roles: ['admin', 'owner', 'super admin', 'staff gudang', 'gudang', 'driver'] },
    { pattern: /^\/api\/pos/, roles: ['admin', 'owner', 'super admin', 'kasir'] },
    { pattern: /^\/api\/products/, roles: ['admin', 'owner', 'super admin', 'kasir'] },
];
let RouteRoleGuard = class RouteRoleGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            return true;
        const roles = (Array.isArray(user.roles) ? user.roles : []).map((r) => r.toLowerCase());
        if (roles.some((r) => ['admin', 'owner', 'super admin'].includes(r))) {
            return true;
        }
        const path = request.path ?? '';
        const matchedRule = ROLE_RULES.find((rule) => rule.pattern.test(path));
        if (!matchedRule)
            return true;
        const allowed = matchedRule.roles.map((r) => r.toLowerCase());
        if (!roles.some((r) => allowed.includes(r))) {
            throw new ForbiddenException('Akses ditolak: role tidak memiliki izin untuk endpoint ini');
        }
        return true;
    }
};
RouteRoleGuard = __decorate([
    Injectable()
], RouteRoleGuard);
export { RouteRoleGuard };
