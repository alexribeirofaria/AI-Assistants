import { ErrorContext as ErrorContextType } from '../domain/error-context.enum';
import { ErrorSeverity } from '../domain/error-severity.enum';

export interface ErrorContext {
  source: string;
  operation: string;
  details?: Record<string, unknown>;
  severity?: ErrorSeverity;
  channel?: 'chat' | 'global';
  category?: 'technical' | 'network' | 'business';
  timestamp?: Date;
  presentToUser?: boolean;
  context?: ErrorContextType;
}
