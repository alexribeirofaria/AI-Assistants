
import { ComponentFixture, TestBed, fakeAsync, flush } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Platform } from '@ionic/angular';

import { HomeComponent } from "./home.component";
import { AlertComponent, AlertType } from "../../components";
import { IAuth} from "../../models";
import { AuthService, AcessoService, AuthGoogleService } from "../../services";

describe('HomeComponent Unit Tests', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockAcessoService: jasmine.SpyObj<AcessoService>;
  let mockGoogleService: jasmine.SpyObj<AuthGoogleService>;
  let mockAlert: jasmine.SpyObj<AlertComponent>;

  beforeEach(() => {
    // Arrange: criar mocks
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['Home', 'isAuthenticated']);
    mockAcessoService = jasmine.createSpyObj('AcessoService', ['signIn']);
    mockGoogleService = jasmine.createSpyObj('AuthGoogleService', ['handleGoogleHome']);
    mockAlert = jasmine.createSpyObj('AlertComponent', ['open']);

    TestBed.configureTestingModule({
imports
      declarations: [HomeComponent],
      providers: [
        FormBuilder,
        Platform,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: AcessoService, useValue: mockAcessoService },
        { provide: AuthGoogleService, useValue: mockGoogleService },
        { provide: AlertComponent, useValue: mockAlert }
      ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize Home form with default values', () => {
    // Act
    component.ngOnInit();
    const formValues = component.HomeForm.getRawValue();

    // Assert
    expect(formValues.email).toBe('user@example.com');
    expect(formValues.senha).toBe('12345T!');
  });

  it('should Home successfully and navigate to dashboard', fakeAsync(() => {
    // Arrange
    const Home: IHome = { email: 'user@example.com', senha: '12345T!' };
    const authResponse: IAuth = { authenticated: true, accessToken: 'token', refreshToken: 'refresh', created: '', expiration: '' };
    mockAcessoService.signIn.and.returnValue(of(authResponse));

    // Act
    component.HomeForm.patchValue(Home);
    component.onHomeClick();
    flush();

    // Assert
    expect(mockAcessoService.signIn).toHaveBeenCalledWith(Home);
    expect(mockAuthService.Home).toHaveBeenCalledWith(authResponse);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should show modal when Home response is not authenticated', fakeAsync(() => {
    // Arrange
    const Home: IHome = { email: 'user@example.com', senha: '12345T!' };
    const authResponse = 'Erro de autenticação';
    mockAcessoService.signIn.and.returnValue(of(authResponse));

    // Act
    component.HomeForm.patchValue(Home);
    component.onHomeClick();
    flush();

    // Assert
    expect(mockAlert.open).toHaveBeenCalledWith(AlertComponent, authResponse, AlertType.Warning);
  }));

  it('should show modal when Home throws an error', fakeAsync(() => {
    // Arrange
    const Home: IHome = { email: 'user@example.com', senha: '12345T!' };
    const error = { error: 'Erro inesperado' };
    mockAcessoService.signIn.and.returnValue(throwError(() => error));

    // Act
    component.HomeForm.patchValue(Home);
    component.onHomeClick();
    flush();

    // Assert
    expect(mockAlert.open).toHaveBeenCalledWith(AlertComponent, 'Erro inesperado', AlertType.Warning);
  }));

  it('should toggle password visibility and eye icon', () => {
    // Arrange
    component.showPassword = false;
    component.eyeIconClass = 'bi-eye';

    // Act
    component.onTooglePassword();

    // Assert
    expect(component.showPassword).toBeTrue();
    expect(component.eyeIconClass).toBe('bi-eye-slash');

    // Act
    component.onTooglePassword();

    // Assert
    expect(component.showPassword).toBeFalse();
    expect(component.eyeIconClass).toBe('bi-eye');
  });

  it('should handle Google Home success', fakeAsync(() => {
    // Arrange
    const authResponse: IAuth = { authenticated: true, accessToken: 'token', refreshToken: 'refresh', created: '', expiration: '' };
    mockGoogleService.handleGoogleHome.and.returnValue(of(authResponse));

    // Act
    component.onGoogleHomeClick();
    flush();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should handle Google Home error', fakeAsync(() => {
    // Arrange
    const errorMessage = 'Erro Google';
    mockGoogleService.handleGoogleHome.and.returnValue(throwError(() => errorMessage));

    // Act
    component.onGoogleHomeClick();
    flush();

    // Assert
    expect(mockAlert.open).toHaveBeenCalledWith(AlertComponent, errorMessage, AlertType.Warning);
  }));
});
