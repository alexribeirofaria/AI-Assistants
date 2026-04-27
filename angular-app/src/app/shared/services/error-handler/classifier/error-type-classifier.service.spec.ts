import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ErrorTypeClassifierService } from './error-type-classifier.service';

describe('ErrorTypeClassifierService Unit Tests', () => {
  let service: ErrorTypeClassifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorTypeClassifierService],
    });

    service = TestBed.inject(ErrorTypeClassifierService);
  });

  it('classifies timeout errors', () => {
    expect(service.classify(new Error('Request timed out after 30s'))).toBe('network-timeout');
  });

  it('classifies offline errors', () => {
    expect(service.classify({ status: 0, message: 'Network error: offline' })).toBe('network-offline');
  });

  it('classifies authorization errors', () => {
    expect(service.classify(new HttpErrorResponse({ status: 401 }))).toBe('api-unauthorized');
    expect(service.classify(new HttpErrorResponse({ status: 403 }))).toBe('api-forbidden');
  });

  it('classifies server and client errors', () => {
    expect(service.classify(new HttpErrorResponse({ status: 500 }))).toBe('api-server');
    expect(service.classify(new HttpErrorResponse({ status: 400 }))).toBe('api-client');
  });

  it('classifies validation errors', () => {
    expect(service.classify(new HttpErrorResponse({ status: 422 }))).toBe('validation');
  });

  it('classifies unknown errors with fallback', () => {
    expect(service.classify(new Error('boom'))).toBe('unexpected');
  });
});
