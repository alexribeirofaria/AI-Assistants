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
import { ErrorContext } from '../domain/error-context.enum';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { HttpStatusInterpreter } from '../mappers/http-status-interpreter';
import { ServiceErrorHandlerService } from '../services/service-error-handler.service';

@Injectable()
export class GlobalHttpErrorInterceptor implements HttpInterceptor {
	constructor(private readonly errorHandler: ServiceErrorHandlerService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				const interpretation = HttpStatusInterpreter.interpret(error.status);

				const handledError = this.errorHandler.handle(error, {
					source: 'HttpInterceptor',
					operation: `${request.method} ${request.url}`,
					category: 'network',
					severity:
						interpretation.severity === 'High'
							? ErrorSeverity.High
							: ErrorSeverity.Medium,
					context: ErrorContext.Http,
					channel: interpretation.statusCode === 401 ? 'global' : 'chat',
					details: {
						method: request.method,
						status: error.status,
						url: request.url,
						interpretation,
					},
				});

				return throwError(() => handledError);
			}),
		);
	}
}
