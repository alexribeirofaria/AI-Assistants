import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { GlobalErrorContextFactoryService } from '../global/global-error-context-factory.service';
import { ServiceErrorHandlerService } from '../service-error-handler.service';

@Injectable()
export class GlobalHttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private readonly serviceErrorHandler: ServiceErrorHandlerService,
    private readonly contextFactory: GlobalErrorContextFactoryService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          if (this.contextFactory.shouldBypassGlobalHttpHandling(request)) {
            return throwError(() => error);
          }

          return throwError(() => this.serviceErrorHandler.handle(
            error,
            this.contextFactory.createHttpContext(error, request)
          ));
        }

        return throwError(() => error);
      })
    );
  }
}
