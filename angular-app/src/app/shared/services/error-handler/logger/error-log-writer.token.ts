import { InjectionToken } from '@angular/core';

import { ErrorLogWriter } from '../contracts/error-log-writer.interface';

export const ERROR_LOG_WRITER = new InjectionToken<ErrorLogWriter>('ERROR_LOG_WRITER');
