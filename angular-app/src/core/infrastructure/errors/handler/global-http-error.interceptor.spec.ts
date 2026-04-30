import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GlobalHttpErrorInterceptor } from './global-http-error.interceptor';
import { ServiceErrorHandlerService } from '../services/service-error-handler.service';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ErrorContext } from '../domain/error-context.enum';

describe('GlobalHttpErrorInterceptor', () => {
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
    httpClient.get('/test').subscribe({
      next: () => fail('Deveria ter falhado'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(errorHandlerSpy.handle).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
          source: 'HttpInterceptor',
          severity: ErrorSeverity.High,
          context: ErrorContext.Http,
          channel: 'chat',
        }));
        done();
      },
    });

    const req = httpMock.expectOne('/test');
    req.flush('Erro', { status: 500, statusText: 'Internal Server Error' });
  });
});
