import { Logger } from "@INFRA/logger";
import { HttpException } from "@nestjs/common";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        if (!(err instanceof HttpException))
          Logger.get().error(err, context.getHandler().name);
        return throwError(() => err);
      })
    );
  }
}
