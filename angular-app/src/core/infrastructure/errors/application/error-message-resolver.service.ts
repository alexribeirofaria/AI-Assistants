import { Injectable } from '@angular/core';
import { ErrorSeverity } from '../domain/error-severity.enum';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageResolverService {
  resolve(operation: string, severity: ErrorSeverity): string {
    if (severity === ErrorSeverity.Critical || severity === ErrorSeverity.High) {
      return 'Ocorreu um erro inesperado. Tente novamente.';
    }

    if (operation === 'sendMessage') {
      return 'Nao foi possivel completar a operacao.';
    }

    return 'Nao foi possivel completar a operacao.';
  }
}
