import { HttpErrorResponse, HttpRequest } from '@angular/common/http';

import { GlobalErrorContextFactoryService } from './global-error-context-factory.service';

describe('GlobalErrorContextFactoryService Unit Tests', () => {
  let service: GlobalErrorContextFactoryService;

  beforeEach(() => {
    service = new GlobalErrorContextFactoryService();
  });

  it('creates runtime global context', () => {
    expect(service.createRuntimeContext()).toEqual({
      source: 'GlobalErrorHandler',
      operation: 'handleError',
      channel: 'global',
    });
  });

  it('creates chat http context for assistant route', () => {
    const request = new HttpRequest('POST', '/assistant');
    const error = new HttpErrorResponse({ status: 500, url: '/assistant' });

    expect(service.createHttpContext(error, request)).toEqual({
      source: '/assistant',
      operation: 'POST /assistant',
      details: { status: 500 },
      channel: 'chat',
    });
  });

  it('bypasses global handling for assistant route', () => {
    expect(service.shouldBypassGlobalHttpHandling(new HttpRequest('POST', '/assistant'))).toBeTrue();
    expect(service.shouldBypassGlobalHttpHandling(new HttpRequest('GET', '/models'))).toBeFalse();
  });
});
