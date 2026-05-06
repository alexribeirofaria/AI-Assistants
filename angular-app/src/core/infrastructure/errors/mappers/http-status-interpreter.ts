import { HttpOutcomeType } from '../domain/http-outcome-type.enum';
import { HttpResponseInterpretation } from '../domain/http-response-interpretation';
import { HttpSeverity } from '../domain/http-severity.enum';
import { TechnicalAction } from '../domain/technical-action.enum';

export class HttpStatusInterpreter {
	static interpret(statusCode: number): HttpResponseInterpretation {
		if (statusCode >= 100 && statusCode < 200) {
			return this.informational(statusCode);
		}

		if (statusCode >= 200 && statusCode < 300) {
			return this.success(statusCode);
		}

		if (statusCode >= 300 && statusCode < 400) {
			return this.redirection(statusCode);
		}

		if (statusCode >= 400 && statusCode < 500) {
			return this.clientError(statusCode);
		}

		if (statusCode >= 500 && statusCode < 600) {
			return this.serverError(statusCode);
		}

		return this.unknown(statusCode);
	}

	private static success(code: number): HttpResponseInterpretation {
		return {
			statusCode: code,
			type: HttpOutcomeType.Success,
			severity: HttpSeverity.None,
			isSuccess: true,
			action: TechnicalAction.None,
			userMessage: this.mapSuccessMessage(code),
			technicalMessage: 'Request completed successfully.',
		};
	}

	private static clientError(code: number): HttpResponseInterpretation {
		return {
			statusCode: code,
			type: HttpOutcomeType.ClientError,
			severity: HttpSeverity.Medium,
			isSuccess: false,
			action: this.mapClientAction(code),
			userMessage: this.mapClientMessage(code),
			technicalMessage: 'Client request failed.',
		};
	}

	private static serverError(code: number): HttpResponseInterpretation {
		return {
			statusCode: code,
			type: HttpOutcomeType.ServerError,
			severity: HttpSeverity.High,
			isSuccess: false,
			action: this.mapServerAction(code),
			userMessage: this.mapServerMessage(code),
			technicalMessage: 'Server failure.',
		};
	}

	private static redirection(code: number): HttpResponseInterpretation {
		return {
			statusCode: code,
			type: HttpOutcomeType.Redirection,
			severity: HttpSeverity.Low,
			isSuccess: true,
			action: TechnicalAction.Redirect,
			userMessage: 'Redirecionando recurso.',
			technicalMessage: 'Redirection required.',
		};
	}

	private static informational(code: number): HttpResponseInterpretation {
		return {
			statusCode: code,
			type: HttpOutcomeType.Informational,
			severity: HttpSeverity.None,
			isSuccess: true,
			action: TechnicalAction.None,
			userMessage: 'Processando requisição...',
			technicalMessage: 'Informational response.',
		};
	}

	private static unknown(code: number): HttpResponseInterpretation {
		return {
			statusCode: code,
			type: HttpOutcomeType.Unknown,
			severity: HttpSeverity.Critical,
			isSuccess: false,
			action: TechnicalAction.Alert,
			userMessage: '⚠️ Erro Inesperado! Tente novamente ou verifique sua conexão.',
			technicalMessage: `Unknown HTTP status code: ${code}`,
		};
	}

	// -----------------------
	// MAPPERS
	// -----------------------

	private static mapSuccessMessage(code: number): string {
		switch (code) {
			case 200:
				return 'Operação realizada com sucesso.';
			case 201:
				return 'Recurso criado com sucesso.';
			case 204:
				return 'Sem conteúdo para exibir.';
			default:
				return 'Sucesso na operação.';
		}
	}

	private static mapClientMessage(code: number): string {
		switch (code) {
			case 400:
				return 'A requisição contém dados inválidos.';
			case 401:
				return 'Não autenticado.';
			case 403:
				return 'Acesso negado.';
			case 404:
				return 'Recurso não encontrado.';
			case 409:
				return 'Conflito na requisição.';
			case 422:
				return 'Não foi possível processar os dados.';
			case 429:
				return 'Muitas requisições. Tente novamente mais tarde.';
			default:
				return 'Erro na requisição.';
		}
	}

	private static mapServerMessage(code: number): string {
		switch (code) {
			case 500:
				return 'Erro interno no servidor.';
			case 502:
				return 'Gateway inválido.';
			case 503:
				return 'Serviço indisponível.';
			case 504:
				return 'Tempo de resposta excedido.';
			default:
				return 'Erro no servidor.';
		}
	}

	private static mapClientAction(code: number): TechnicalAction {
		switch (code) {
			case 401:
				return TechnicalAction.RefreshToken;
			case 429:
				return TechnicalAction.RetryWithBackoff;
			case 408:
				return TechnicalAction.Retry;
			default:
				return TechnicalAction.StopPipeline;
		}
	}

	private static mapServerAction(code: number): TechnicalAction {
		switch (code) {
			case 503:
			case 502:
			case 504:
				return TechnicalAction.RetryWithBackoff;
			default:
				return TechnicalAction.Alert;
		}
	}
}
