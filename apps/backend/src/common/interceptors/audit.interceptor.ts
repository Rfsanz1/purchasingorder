import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;
    const path = request.url;
    const actorId = user?.sub ?? user?.id ?? null;

    return next.handle().pipe(
      tap(async () => {
        await this.prisma.auditLog.create({
          data: {
            actorId,
            action: `${method} ${path}`,
            resource: path,
            metadata: {
              body: request.body,
              params: request.params,
              query: request.query,
            },
          },
        });
      }),
    );
  }
}
