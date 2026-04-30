import { ErrorSeverity } from './error-severity';
import { ErrorCodes } from './error-codes';

export interface ErrorContext {
  source: string;
  operation: string;
  severity?: ErrorSeverity;
  code?: ErrorCodes;
  details?: Record<string, unknown>;
  timestamp?: Date;
}
