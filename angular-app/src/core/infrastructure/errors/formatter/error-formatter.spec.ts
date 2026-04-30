import { TestBed } from '@angular/core/testing';
import { ErrorFormatter } from './error-formatter';
import { ErrorContext } from '../contracts/i-error-context';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ErrorContext as DomainErrorContext } from '../domain/error-context.enum';

describe('ErrorFormatter', () => {
  let formatter: ErrorFormatter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorFormatter],
    });
    formatter = TestBed.inject(ErrorFormatter);
  });

  it('deve formatar o nome do arquivo no padrao log_dev_Classe_Data.md', () => {
    const context: ErrorContext = {
      source: 'ChatGateway',
      operation: 'sendMessage',
    };

    const result = formatter.format(new Error('test'), context);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    expect(result.destination).toBe(`log_dev_ChatGateway_${date}.md`);
  });

  it('deve incluir classe, operacao e mensagem amigavel no markdown', () => {
    const result = formatter.format(new Error('fail'), {
      source: 'CoreService',
      operation: 'init',
      severity: ErrorSeverity.High,
      context: DomainErrorContext.Application,
    });

    expect(result.content).toContain('# Error Report');
    expect(result.content).toContain('- Source: CoreService');
    expect(result.content).toContain('- Operation: init');
    expect(result.content).toContain('- Friendly Message: Ocorreu um erro inesperado. Tente novamente.');
  });

  it('deve retornar a entidade associada ao log formatado', () => {
    const result = formatter.format(new Error('err'), {
      source: 'API',
      operation: 'fetch',
      details: { requestId: '1' },
    });

    expect(result.entity.source).toBe('API');
    expect(result.entity.operation).toBe('fetch');
    expect(result.entity.details).toEqual({ requestId: '1' });
  });
});
