import { Injectable } from '@angular/core';
import { ErrorLoggerUseCase } from '../application/error-logger.usecase';
import { FormattedError, IErrorLogger } from '../contracts/i-error-logger';

@Injectable({
  providedIn: 'root',
})
export class ErrorLoggerService implements IErrorLogger {
  constructor(private readonly loggerUseCase: ErrorLoggerUseCase) {}

  log(formattedError: FormattedError): void {
    this.loggerUseCase.execute(formattedError.entity, formattedError.destination);
  }
}
