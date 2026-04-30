import { ErrorContext } from './error-context.enum';
import { ErrorSeverity } from './error-severity.enum';

export class ErrorEntity {
  constructor(
    public readonly message: string,
    public readonly friendlyMessage: string,
    public readonly context: ErrorContext,
    public readonly severity: ErrorSeverity,
    public readonly timestamp: string,
    public readonly source: string,
    public readonly operation: string,
    public readonly stack?: string,
    public readonly details?: Record<string, unknown>,
    public readonly environment = 'dev',
  ) {}
}
