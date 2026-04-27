import { Inject, Injectable } from '@angular/core';

import { FormattedError } from '../contracts/formatted-error.interface';
import { ErrorFormatterService } from '../formatter/error-formatter.service';
import { ERROR_LOG_WRITER } from './error-log-writer.token';
import { ErrorLogWriter } from '../contracts/error-log-writer.interface';

@Injectable({
  providedIn: 'root',
})
export class ErrorLoggerService {
  private lastSignature?: string;
  private readonly sequences = new Map<string, number>();

  constructor(
    private readonly formatter: ErrorFormatterService,
    @Inject(ERROR_LOG_WRITER) private readonly writer: ErrorLogWriter
  ) {}

  log(formattedError: FormattedError): void {
    if (this.lastSignature === formattedError.signature) {
      return;
    }

    const sequence = this.nextSequence(formattedError.destination);
    this.writer.write(
      formattedError.destination,
      this.formatter.toLogEntry(formattedError, sequence)
    );
    this.lastSignature = formattedError.signature;
  }

  private nextSequence(destination: string): number {
    const current = this.sequences.get(destination) ?? 0;
    this.sequences.set(destination, current + 1);
    return current;
  }
}
