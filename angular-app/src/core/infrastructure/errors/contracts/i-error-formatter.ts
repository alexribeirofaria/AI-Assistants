import { ErrorEntity } from '../domain/error.entity';
import { ErrorContext } from './i-error-context';

export interface FormattedError {
  content: string;
  destination: string;
  publicMessage: string;
  entity: ErrorEntity;
}

export interface IErrorFormatter {
  format(error: unknown, context: ErrorContext): FormattedError;
}
