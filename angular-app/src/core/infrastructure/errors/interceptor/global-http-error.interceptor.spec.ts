import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ErrorContext } from '../domain/error-context.enum';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ServiceErrorHandlerService } from '../services/service-error-handler.service';
import { GlobalHttpErrorInterceptor } from './global-http-error.interceptor';

describe('GlobalHttpErrorInterceptor Unit Tests', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let errorHandlerSpy: jasmine.SpyObj<ServiceErrorHandlerService>;

  beforeEach(() => {
    errorHandlerSpy = jasmine.createSpyObj<ServiceErrorHandlerService>('ServiceErrorHandlerService', ['handle']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: GlobalHttpErrorInterceptor,
          multi: true,
        },
        { provide: ServiceErrorHandlerService, useValue: errorHandlerSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve interceptar erros HTTP e delegar para o handler central', (done) => {
    const mockHandledError = new Error('Friendly Error Message');
    (mockHandledError as any).status = 500;
    errorHandlerSpy.handle.and.returnValue(mockHandledError);

    httpClient.get('/test').subscribe({
      next: () => fail('Deveria ter falhado'),
      error: (error) => {
        expect(error.message).toBe('Friendly Error Message');
        expect(error.status).toBe(500);
        expect(errorHandlerSpy.handle).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
          source: 'HttpInterceptor',
          severity: ErrorSeverity.High,
          context: ErrorContext.Http,
          channel: 'chat',
          details: jasmine.objectContaining({
            interpretation: jasmine.objectContaining({
              statusCode: 500,
              isSuccess: false
            })
          })
        }));
        done();
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush('Erro', { status: 500, statusText: 'Internal Server Error' });
  });
});
