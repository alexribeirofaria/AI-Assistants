import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom, timeout } from 'rxjs';
import {
	IAssistantResponse,
	IChangeProviderResponse,
	IModelsListResponse,
	IProviderListResponse,
} from '../../../../application/interfaces';
import { ServiceErrorHandlerService } from '../../../errors/services/service-error-handler.service';
import { IChatGateway, IChatMessageContext } from '../../interfaces';
import { BaseHttpGateway } from '../abstract/base-http.gateway';

@Injectable({
	providedIn: 'root',
})
export class HttpChatGateway extends BaseHttpGateway implements IChatGateway {
	private static readonly REQUEST_TIMEOUT_MS = 30000;

	constructor(http: HttpClient, errorHandler: ServiceErrorHandlerService) {
		super({ http, errorHandler });
	}

	async getProviders(): Promise<string[]> {
		try {
			const response = await firstValueFrom(
				this.get<IProviderListResponse>('/providers').pipe(
					timeout(HttpChatGateway.REQUEST_TIMEOUT_MS),
				),
			);
			this.throwIfGatewayErrorPayload(response, 'getProviders');
			return response.providers || [];
		} catch (error) {
			throw this.handleGatewayError(error, 'getProviders');
		}
	}

	async getModels(provider?: string): Promise<IModelsListResponse> {
		const normalizedProvider = this.normalizeProviderForHttp(provider);
		const params = normalizedProvider
			? `?provider=${encodeURIComponent(normalizedProvider)}`
			: '';
		try {
			const response = await lastValueFrom(
				this.get<IModelsListResponse>(`/models${params}`).pipe(
					timeout(HttpChatGateway.REQUEST_TIMEOUT_MS),
				),
			);
			this.throwIfGatewayErrorPayload(response, 'getModels');
			return {
				defaultModel: response.defaultModel,
				models: response.models || [],
			};
		} catch (error) {
			throw this.handleGatewayError(error, 'getModels');
		}
	}

	async getDefaultModel(provider?: string): Promise<string | undefined> {
		const normalizedProvider = this.normalizeProviderForHttp(provider);
		const params = normalizedProvider
			? `?provider=${encodeURIComponent(normalizedProvider)}`
			: '';
		try {
			const response = await firstValueFrom(
				this.get<IModelsListResponse>(`/default-model${params}`).pipe(
					timeout(HttpChatGateway.REQUEST_TIMEOUT_MS),
				),
			);
			this.throwIfGatewayErrorPayload(response, 'getDefaultModel');
			return response.defaultModel;
		} catch (error) {
			throw this.handleGatewayError(error, 'getDefaultModel');
		}
	}

	async changeProvider(provider: string): Promise<IChangeProviderResponse> {
		const normalizedProvider = this.normalizeProviderForHttp(provider);
		try {
			const response = await firstValueFrom(
				this.post<IChangeProviderResponse>('/change-provider', {
					provider: normalizedProvider,
				}).pipe(timeout(HttpChatGateway.REQUEST_TIMEOUT_MS)),
			);
			this.throwIfGatewayErrorPayload(response, 'changeProvider');
			return response;
		} catch (error) {
			throw this.handleGatewayError(error, 'changeProvider');
		}
	}

	async sendMessage(
		content: string,
		_context?: IChatMessageContext,
	): Promise<IAssistantResponse> {
		if (!this.http) {
			throw this.buildServiceError(
				'sendMessage',
				'HttpClient não configurado para este serviço',
			);
		}

		try {
			const response = await firstValueFrom(
				this.http
					.post<IAssistantResponse>(
						`${this.baseUrl}/assistant`,
						{ message: content },
						{ observe: 'response' },
					)
					.pipe(timeout(HttpChatGateway.REQUEST_TIMEOUT_MS)),
			);

			const body = response.body ?? { input: content };
			this.throwIfGatewayErrorPayload(body, 'sendMessage');
			return {
				...body,
				statusCode: response.status,
			};
		} catch (error) {
			throw this.handleGatewayError(error, 'sendMessage');
		}
	}

	private handleGatewayError(error: unknown, operation: string): Error {
		if (error instanceof Error && (error as any).__globalErrorHandled) {
			return error;
		}

		if (error instanceof Error && error.name === 'TimeoutError') {
			return this.buildServiceError(
				operation,
				'GATEWAY_TIMEOUT',
				undefined,
				'chat',
			);
		}

		const status =
			error instanceof HttpErrorResponse ? error.status : undefined;

		return this.buildServiceError(
			operation,
			error instanceof Error ? error.message : String(error),
			status ? { status } : undefined,
			'chat',
		);
	}

	private throwIfGatewayErrorPayload(
		response: unknown,
		operation: string,
	): void {
		if (!response || typeof response !== 'object') {
			return;
		}

		const payload = response as Record<string, unknown>;
		let errorMessage: string | null = null;
		let status: number | null = null;

		// Check explicit error field
		if (
			typeof payload['error'] === 'string' &&
			payload['error'].trim().length > 0
		) {
			errorMessage = payload['error'];
		} else if (payload['error'] && typeof payload['error'] === 'object') {
			const nested = payload['error'] as Record<string, unknown>;
			errorMessage =
				(nested['message'] as string) ||
				(nested['error'] as string) ||
				JSON.stringify(payload['error']);
		}

		// Check status code
		if (typeof payload['status'] === 'number') {
			status = payload['status'];
		}

		const isErrorStatus = status !== null && (status < 200 || status >= 300);

		// Check if array fields (e.g. models) contain error strings
		if (!errorMessage) {
			for (const key of Object.keys(payload)) {
				const value = payload[key];
				if (Array.isArray(value)) {
					const firstString = value.find((item) => typeof item === 'string') as
						| string
						| undefined;
					if (firstString && this.looksLikeTechnicalError(firstString)) {
						errorMessage = firstString;
						break;
					}
				}
			}
		}

		if (!errorMessage && !isErrorStatus) {
			return;
		}

		throw this.buildServiceError(
			operation,
			errorMessage || `Falha HTTP (${status})`,
			status ? { status } : undefined,
			'chat',
		);
	}

	private looksLikeTechnicalError(text: string): boolean {
		const raw = text.trim();
		return (
			/^\[(UNKNOWN ERROR|QUOTA ERROR|ERROR)\]/i.test(raw) ||
			/\bError code:\s*\d{3}\b/i.test(raw) ||
			/\bauthentication_error\b/i.test(raw) ||
			/\binvalid x-api-key\b/i.test(raw) ||
			/\bunauthorized\b/i.test(raw) ||
			/\bforbidden\b/i.test(raw) ||
			/\brate[_\s-]?limit\b/i.test(raw) ||
			/\bquota\b/i.test(raw)
		);
	}

	private normalizeProviderForHttp(provider?: string): string {
		return (provider ?? '').trim().toLowerCase().replace(/\s+/g, '');
	}
}
