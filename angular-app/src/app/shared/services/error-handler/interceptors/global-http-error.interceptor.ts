import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ServiceErrorHandlerService } from '../service-error-handler.service';

@Injectable()
export class GlobalHttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly errorHandler: ServiceErrorHandlerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        if (request.url.includes('__client-error-log')) {
          return throwError(() => error);
        }

        if (error instanceof HttpErrorResponse) {
          const isChatRequest = request.url.includes('/assistant');

          return throwError(() => this.errorHandler.handle(error, {
            source: request.url,
            operation: `${request.method} ${request.url}`,
            details: {
              status: error.status,
            },
            channel: isChatRequest ? 'chat' : 'global',
          }));
        }

        return throwError(() => error);
      })
    );
  }
}
