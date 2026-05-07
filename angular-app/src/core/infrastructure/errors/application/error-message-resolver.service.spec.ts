import { TestBed } from '@angular/core/testing';
import { ErrorMessageResolverService } from './error-message-resolver.service';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ErrorContext as ErrorContextType } from '../domain/error-context.enum';

describe('ErrorMessageResolverService Unit Tests', () => {
  let service: ErrorMessageResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMessageResolverService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve resolver mensagem amigavel para erro 404', () => {
    const result = service.resolve('test', ErrorSeverity.High, 'Error', {
      source: 'test',
      operation: 'test',
      context: ErrorContextType.Http,
      details: { status: 404 }
    });
    expect(result).toBe('Recurso não encontrado.');
  });

  it('deve resolver mensagem amigavel para erro 500', () => {
    const result = service.resolve('test', ErrorSeverity.High, 'Error', {
      source: 'test',
      operation: 'test',
      context: ErrorContextType.Http,
      details: { status: 500 }
    });
    expect(result).toBe('Erro interno no servidor.');
  });

  it('deve retornar a mensagem amigavel conhecida se for fornecida', () => {
// ... (rest of the file)
    const knownMessage = 'Limite de uso atingido. Tente novamente em instantes.';
    const result = service.resolve('sendMessage', ErrorSeverity.High, knownMessage);
    expect(result).toBe(knownMessage);
  });

  it('deve retornar mensagem customizada para operacao sendMessage', () => {
    const result = service.resolve('sendMessage', ErrorSeverity.Medium);
    expect(result).toBe('Nao foi possivel enviar a mensagem. Tente novamente em instantes.');
  });

  it('deve retornar mensagem customizada para operacao getProviders', () => {
    const result = service.resolve('getProviders', ErrorSeverity.Low);
    expect(result).toBe('Nao conseguimos carregar os provedores. Verifique sua conexao e tente novamente.');
  });

  it('deve retornar mensagem customizada para operacao getModels', () => {
    const result = service.resolve('getModels', ErrorSeverity.Critical);
    expect(result).toBe('Nenhum modelo esta disponivel para este provider.');
  });

  it('deve retornar mensagem customizada para operacao getDefaultModel', () => {
    const result = service.resolve('getDefaultModel', ErrorSeverity.High);
    expect(result).toBe('Nao conseguimos definir o modelo padrao. Selecione um manualmente.');
  });

  it('deve retornar mensagem customizada para operacao changeProvider', () => {
    const result = service.resolve('changeProvider', ErrorSeverity.Medium);
    expect(result).toBe('Nao foi possivel trocar de provedor. Tente novamente em instantes.');
  });

  it('deve retornar mensagem generica para erro critico de operacao desconhecida', () => {
    const result = service.resolve('unknownOperation', ErrorSeverity.Critical);
    expect(result).toBe('Ocorreu um erro inesperado. Tente novamente.');
  });

  it('deve retornar mensagem generica para erro high de operacao desconhecida', () => {
    const result = service.resolve('unknownOperation', ErrorSeverity.High);
    expect(result).toBe('Ocorreu um erro inesperado. Tente novamente.');
  });

  it('deve retornar mensagem de operacao incompleta para operacao desconhecida com severidade baixa', () => {
    const result = service.resolve('unknownOperation', ErrorSeverity.Low);
    expect(result).toBe('Nao foi possivel completar a operacao.');
  });
});
