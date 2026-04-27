import { Injectable } from '@angular/core';

import { ErrorLogWriter } from '../contracts/error-log-writer.interface';
import { LocalStorageErrorLogWriterService } from './local-storage-error-log-writer.service';

@Injectable({
  providedIn: 'root',
})

export class FileErrorLogWriterService implements ErrorLogWriter {
  private static readonly ENDPOINT = '/log-error';

  constructor(private readonly localWriter: LocalStorageErrorLogWriterService) { }

  write(destination: string, content: string): void {
    const payload = this.encodePayload(destination, content);
    const url = `${FileErrorLogWriterService.ENDPOINT}?payload=${encodeURIComponent(payload)}`;

    if (typeof fetch === 'function') {
      fetch(url, { method: 'GET', keepalive: true }).catch(() => {
        this.localWriter.write(destination, content);
      });
      return;
    }

    this.localWriter.write(destination, content);
  }

  private encodePayload(destination: string, content: string): string {
    return JSON.stringify({ destination, content });
  }
}
