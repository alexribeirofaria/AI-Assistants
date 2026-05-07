import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ChatErrorMapper {
	private readonly messages: Record<string, string> = {
		chat: 'Ocorreu um erro no chat. Tente novamente.',
		sendMessage:
			'Não foi possível enviar a mensagem. Tente novamente em instantes.',
		receiveResponse:
			'Não foi possível obter uma resposta da IA. Tente novamente.',
		executeTool: 'Ocorreu um erro ao executar a ferramenta. Tente novamente.',
		getProviders:
			'Não conseguimos carregar os provedores. Verifique sua conexão e tente novamente.',
		getModels: 'Nenhum modelo está disponível para este provedor no momento.',
		getDefaultModel:
			'Não conseguimos definir o modelo padrão. Selecione um manualmente.',
		changeProvider:
			'Não foi possível trocar de provedor. Tente novamente em instantes.',
		GATEWAY_TIMEOUT:
			'A resposta demorou mais que o esperado. Tente novamente em instantes.',
	};

	private readonly technicalMarkers: Record<string, string> = {
		quota: 'Limite de uso atingido. Tente novamente em instantes.',
		rate_limit: 'Limite de uso atingido. Tente novamente em instantes.',
		authentication_error: 'Falha de autenticação com o provedor configurado.',
		'invalid x-api-key': 'Falha de autenticação com o provedor configurado.',
		unauthorized: 'Falha de autenticação com o provedor configurado.',
		forbidden: 'Falha de autenticação com o provedor configurado.',
		'401': 'Falha de autenticação com o provedor configurado.',
		model_not_found: 'O modelo selecionado não está mais disponível.',
		decommissioned: 'O modelo selecionado não está mais disponível.',
	};

	isFriendlyMessage(message: string): boolean {
		return (
			Object.values(this.messages).includes(message) ||
			Object.values(this.technicalMarkers).includes(message)
		);
	}

	resolve(operation: string, originalMessage?: string): string | undefined {
		// 1. Prioritize technical markers if message is present
		if (originalMessage) {
			const normalizedMessage = originalMessage.toLowerCase();
			for (const [marker, friendlyMessage] of Object.entries(
				this.technicalMarkers,
			)) {
				if (normalizedMessage.includes(marker.toLowerCase())) {
					return friendlyMessage;
				}
			}

			// 2. Specific code for timeout
			if (originalMessage === 'GATEWAY_TIMEOUT') {
				return this.messages['GATEWAY_TIMEOUT'];
			}
		}

		// 3. Fallback to operation-based message
		return this.messages[operation];
	}
}
