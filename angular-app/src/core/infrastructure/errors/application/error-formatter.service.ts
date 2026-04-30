import { Injectable } from '@angular/core';
import { ErrorEntity } from '../domain/error.entity';

@Injectable({
  providedIn: 'root',
})
export class ErrorFormatterService {
  format(error: ErrorEntity): string {
    const lines = [
      '# Error Report',
      '',
      `- Message: ${error.message}`,
      `- Friendly Message: ${error.friendlyMessage}`,
      `- Context: ${error.context}`,
      `- Severity: ${error.severity}`,
      `- Source: ${error.source}`,
      `- Operation: ${error.operation}`,
      `- Environment: ${error.environment}`,
      `- Timestamp: ${error.timestamp}`,
      '',
      '## Stack',
      '',
      '```text',
      error.stack || 'N/A',
      '```',
    ];

    if (error.details) {
      lines.push('', '## Details', '', '```json', JSON.stringify(error.details, null, 2), '```');
    }

    lines.push('', '---', '');
    return lines.join('\n');
  }
}
