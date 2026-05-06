import { HttpStatusInterpreter } from './http-status-interpreter';
import { HttpOutcomeType } from '../domain/http-outcome-type.enum';
import { HttpSeverity } from '../domain/http-severity.enum';
import { TechnicalAction } from '../domain/technical-action.enum';

describe('HttpStatusInterpreter Unit Tests', () => {
  describe('interpret', () => {
    it('deve interpretar 200 como Success', () => {
      const result = HttpStatusInterpreter.interpret(200);
      expect(result.statusCode).toBe(200);
      expect(result.type).toBe(HttpOutcomeType.Success);
      expect(result.isSuccess).toBeTrue();
      expect(result.userMessage).toBe('Operação realizada com sucesso.');
    });

    it('deve interpretar 201 como Success com mensagem de criação', () => {
      const result = HttpStatusInterpreter.interpret(201);
      expect(result.type).toBe(HttpOutcomeType.Success);
      expect(result.userMessage).toBe('Recurso criado com sucesso.');
    });

    it('deve interpretar 401 como ClientError com RefreshToken action', () => {
      const result = HttpStatusInterpreter.interpret(401);
      expect(result.type).toBe(HttpOutcomeType.ClientError);
      expect(result.isSuccess).toBeFalse();
      expect(result.action).toBe(TechnicalAction.RefreshToken);
      expect(result.userMessage).toBe('Não autenticado.');
    });

    it('deve interpretar 404 como ClientError com StopPipeline action', () => {
      const result = HttpStatusInterpreter.interpret(404);
      expect(result.type).toBe(HttpOutcomeType.ClientError);
      expect(result.action).toBe(TechnicalAction.StopPipeline);
    });

    it('deve interpretar 429 como ClientError com RetryWithBackoff action', () => {
      const result = HttpStatusInterpreter.interpret(429);
      expect(result.action).toBe(TechnicalAction.RetryWithBackoff);
    });

    it('deve interpretar 500 como ServerError com High severity', () => {
      const result = HttpStatusInterpreter.interpret(500);
      expect(result.type).toBe(HttpOutcomeType.ServerError);
      expect(result.severity).toBe(HttpSeverity.High);
      expect(result.action).toBe(TechnicalAction.Alert);
    });

    it('deve interpretar 503 como ServerError com RetryWithBackoff action', () => {
      const result = HttpStatusInterpreter.interpret(503);
      expect(result.action).toBe(TechnicalAction.RetryWithBackoff);
    });

    it('deve interpretar 302 como Redirection', () => {
      const result = HttpStatusInterpreter.interpret(302);
      expect(result.type).toBe(HttpOutcomeType.Redirection);
      expect(result.action).toBe(TechnicalAction.Redirect);
    });

    it('deve interpretar 101 como Informational', () => {
      const result = HttpStatusInterpreter.interpret(101);
      expect(result.type).toBe(HttpOutcomeType.Informational);
    });

    it('deve interpretar códigos desconhecidos (ex: 600) como Unknown', () => {
      const result = HttpStatusInterpreter.interpret(600);
      expect(result.type).toBe(HttpOutcomeType.Unknown);
      expect(result.severity).toBe(HttpSeverity.Medium);
    });
  });
});
