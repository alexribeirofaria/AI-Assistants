import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ServiceErrorContext } from '../contracts/service-error-context.interface';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorContextFactoryService {
  private static readonly ASSISTANT_PATH = '/assistant';

  createRuntimeContext(): ServiceErrorContext {
    return {
      source: 'GlobalErrorHandler',
      operation: 'handleError',
      channel: 'global',
    };
  }

  createHttpContext(error: HttpErrorResponse, request: HttpRequest<unknown>): ServiceErrorContext {
    return {
      source: request.url,
      operation: `${request.method} ${request.url}`,
      details: { status: error.status },
      channel: this.isChatRequest(request) ? 'chat' : 'global',
      presentToUser: false,
    };
  }

  shouldBypassGlobalHttpHandling(request: HttpRequest<unknown>): boolean {
    return this.isChatRequest(request);
  }

  private isChatRequest(request: HttpRequest<unknown>): boolean {
    return request.url.includes(GlobalErrorContextFactoryService.ASSISTANT_PATH);
  }
}
