export { FormattedError } from './i-error-formatter';
import { FormattedError } from './i-error-formatter';

export interface IErrorLogger {
  log(formattedError: FormattedError): void;
}
