import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormattedError } from '../contracts/formatted-error.interface';
import { ServiceErrorContext } from '../contracts/service-error-context.interface';

interface NormalizedError {
  name: string;
  message: string;
  stack?: string;
  statusCode?: number;
  statusText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorFormatterService {
  private static readonly FRIENDLY_SUGGESTION_MESSAGE =
    'Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.';

  format(error: unknown, context: ServiceErrorContext): FormattedError {
    const normalized = this.normalizeError(error);
    const timestamp = new Date().toISOString();
    const publicMessage = this.resolvePublicMessage(context.channel);

    return {
      id: this.buildId(timestamp, context),
      destination: this.buildDestination(context.source, timestamp),
      timestamp,
      source: context.source,
      operation: context.operation,
      errorType: normalized.name,
      technicalMessage: normalized.message,
      publicMessage,
      statusCode: normalized.statusCode,
      statusText: normalized.statusText,
      stack: normalized.stack,
      details: context.details,
      channel: context.channel ?? 'global',
      signature: this.buildSignature(normalized, context),
    };
  }

  toLogEntry(formattedError: FormattedError, sequence: number): string {
    const status = formattedError.statusCode ?? 500;
    const lines = [
      `# Log de Erro ${String(sequence).padStart(4, '0')}`,
      '- Fonte: `angular_dev`',
      `- Endpoint: \`${formattedError.operation}\``,
      `- Metodo: \`${formattedError.channel === 'chat' ? 'CHAT' : 'CLIENT'}\``,
      `- URL: \`${formattedError.source}\``,
      `- Timestamp: \`${formattedError.timestamp}\``,
      `- Status: \`${status}\``,
      `- Code: \`${formattedError.errorType}\``,
      `- Mensagem Publica: \`${formattedError.publicMessage}\``,
      '## Erro',
      '```text',
      formattedError.technicalMessage,
      '```',
    ];

    if (formattedError.details && Object.keys(formattedError.details).length > 0) {
      lines.push('', '## Detalhes', '```json', JSON.stringify(formattedError.details, null, 2), '```');
    }

    if (formattedError.stack) {
      lines.push('', '## Stack', '```text', formattedError.stack, '```');
    }

    lines.push('', '---', '');

    return lines.join('\n');
  }

  private normalizeError(error: unknown): NormalizedError {
    if (error instanceof HttpErrorResponse) {
      return {
        name: error.name || 'HttpErrorResponse',
        message: this.extractHttpMessage(error),
        stack: error.error instanceof Error ? error.error.stack : undefined,
        statusCode: error.status,
        statusText: error.statusText || undefined,
      };
    }

    if (error instanceof Error) {
      return {
        name: error.name || 'Error',
        message: error.message || 'Erro sem mensagem',
        stack: error.stack,
      };
    }

    if (error && typeof error === 'object') {
      const candidate = error as {
        name?: unknown;
        message?: unknown;
        stack?: unknown;
        status?: unknown;
        statusText?: unknown;
      };

      return {
        name: typeof candidate.name === 'string' && candidate.name.trim() ? candidate.name : 'Error',
        message: this.normalizeMessage(candidate.message),
        stack: typeof candidate.stack === 'string' ? candidate.stack : undefined,
        statusCode: typeof candidate.status === 'number' ? candidate.status : undefined,
        statusText: typeof candidate.statusText === 'string' ? candidate.statusText : undefined,
      };
    }

    return {
      name: 'Error',
      message: this.normalizeMessage(error),
    };
  }

  private extractHttpMessage(error: HttpErrorResponse): string {
    const payload = error.error;

    if (payload instanceof Error && payload.message.trim()) {
      return payload.message;
    }

    if (payload && typeof payload === 'object' && 'message' in payload) {
      return this.normalizeMessage((payload as { message?: unknown }).message);
    }

    return this.normalizeMessage(error.message);
  }

  private normalizeMessage(message: unknown): string {
    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    return 'Erro sem detalhes tecnicos disponiveis';
  }

  private resolvePublicMessage(channel: ServiceErrorContext['channel']): string {
    void channel;
    return ErrorFormatterService.FRIENDLY_SUGGESTION_MESSAGE;
  }

  private buildId(timestamp: string, context: ServiceErrorContext): string {
    return `${timestamp}-${context.source}-${context.operation}`.replace(/[^a-zA-Z0-9-]/g, '_');
  }

  private buildDestination(source: string, timestamp: string): string {
    const normalizedSource = source
      .split('/')
      .filter(Boolean)
      .pop() ?? source;
    const sanitizedSource = normalizedSource.replace(/[^a-zA-Z0-9]+/g, '_') || 'Error';
    const date = timestamp.slice(0, 10).replace(/-/g, '');

    return `.log_erros/log_angular_dev_${sanitizedSource}_${date}.md`;
  }

  private buildSignature(normalized: NormalizedError, context: ServiceErrorContext): string {
    return [
      context.source,
      context.operation,
      normalized.name,
      normalized.message,
      String(normalized.statusCode ?? ''),
    ].join('|');
  }
}
