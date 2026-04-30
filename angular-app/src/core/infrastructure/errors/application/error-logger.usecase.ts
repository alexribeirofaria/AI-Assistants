import { Injectable } from '@angular/core';
import { ErrorEntity } from '../domain/error.entity';
import { ErrorFormatterService } from './error-formatter.service';
import { FileErrorRepository } from '../infrastructure/file-error.repository';
import { SsrErrorWriterService } from '../infrastructure/ssr-error-writer.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorLoggerUseCase {
  constructor(
    private readonly formatter: ErrorFormatterService,
    private readonly repository: FileErrorRepository,
    private readonly writer: SsrErrorWriterService,
  ) {}

  execute(error: ErrorEntity, fileName: string): void {
    if (!this.writer.canWrite()) {
      return;
    }

    const content = this.formatter.format(error);
    const filePath = this.writer.resolveLogFile(fileName);

    this.repository.save(
      filePath,
      content,
      (path) => this.writer.read(path),
      (path, value) => this.writer.write(path, value),
    );
  }
}
