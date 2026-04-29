import { Injectable } from '@angular/core';

import { ErrorLogWriter } from '../contracts/error-log-writer.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageErrorLogWriterService implements ErrorLogWriter {
  write(destination: string, content: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const current = localStorage.getItem(destination) ?? '';
    localStorage.setItem(destination, `${current}${content}`);
  }
}
