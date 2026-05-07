import { HttpOutcomeType } from './http-outcome-type.enum';
import { HttpSeverity } from './http-severity.enum';
import { TechnicalAction } from './technical-action.enum';

export interface HttpResponseInterpretation {
  statusCode: number;
  type: HttpOutcomeType;
  severity: HttpSeverity;
  userMessage: string;
  technicalMessage: string;
  action: TechnicalAction;
  isSuccess: boolean;
}
