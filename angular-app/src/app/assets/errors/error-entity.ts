import { ErrorCodes } from './error-codes';
import { ErrorSeverity } from './error-severity';

export class ErrorEntity {
  constructor(
    public readonly code: ErrorCodes,
    public readonly severity: ErrorSeverity,
    public readonly publicMessage: string,
    public readonly technicalMessage?: string,
    public readonly stack?: string,
  ) {}
}
