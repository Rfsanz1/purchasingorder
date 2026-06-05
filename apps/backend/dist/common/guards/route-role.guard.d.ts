import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RouteRoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
