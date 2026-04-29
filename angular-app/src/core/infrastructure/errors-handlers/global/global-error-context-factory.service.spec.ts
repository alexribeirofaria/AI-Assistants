import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { GlobalErrorContextFactoryService } from './global-error-context-factory.service';

const mockHttpRequest = (method: string, url: string): any => ({
  method,
  url,
  headers: new HttpHeaders()
});

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
    const request = mockHttpRequest('POST', '/assistant');
    const error = new HttpErrorResponse({ status: 500, url: '/assistant' });

    expect(service.createHttpContext(error, request as any)).toEqual({
      source: '/assistant',
      operation: 'POST /assistant',
      details: { status: 500 },
      channel: 'chat',
    });
  });

  it('bypasses global handling for assistant route', () => {
    expect(service.shouldBypassGlobalHttpHandling(mockHttpRequest('POST', '/assistant'))).toBeTrue();
    expect(service.shouldBypassGlobalHttpHandling(mockHttpRequest('GET', '/models'))).toBeFalse();
  });
});
