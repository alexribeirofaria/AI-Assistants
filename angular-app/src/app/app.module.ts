import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MomentDateModule } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, provideRouter } from '@angular/router';
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AppRoutingModule } from './shared/route/app.routing.module';
import { AuthService, CustomInterceptor } from './shared/services';
import { AuthServiceBase } from './shared/services/auth/auth.abstract.service';
import { HomeModule } from './pages/home/home.module';
import { AlertModule } from './shared/components/alert-component/alert.component.module';

export function initializeAuth(authService: AuthServiceBase) {
  return () => authService.autoLogin();
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      HomeModule,
      AlertModule,
      BrowserAnimationsModule,
      AppRoutingModule || RouterModule.forRoot([]),
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MomentDateModule,
      NgbDropdownModule,
      NgxMaskDirective,
      NgxMaskPipe
    ),
    provideRouter([]),
    provideHttpClient(withInterceptorsFromDi()),
    provideNgxMask(),
    AuthService,
    NgbActiveModal,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-br' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ]
};