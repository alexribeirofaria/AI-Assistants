import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule, provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./route/app.routing.module";
import { AlertModule } from "./shared/components/alert/alert.component.module";
import { ChatModule } from "./shared/components/chat/chat.module";
import { CookieConsentComponent } from "./shared/components/cookie-consent/cookie-consent.component";
import { LayoutComponent } from "./shared/components/layout/layout.component";
import { GlobalErrorHandler } from "../core/infrastructure/errors/handler/global-error-handler";
import { GlobalHttpErrorInterceptor } from "../core/infrastructure/errors/handler/global-http-error.interceptor";
import { ErrorFormatter } from "../core/infrastructure/errors/formatter/error-formatter";
import { ErrorLoggerService } from "../core/infrastructure/errors/logger/error-logger.service";
import { UIErrorPresenter } from "../core/infrastructure/errors/presenter/ui-error-presenter";
import { ErrorModule } from "../core/infrastructure/errors/error.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    ChatModule,
    AlertModule,
    LayoutComponent,
    CookieConsentComponent,
    ErrorModule,
  ],
  providers: [
    ErrorFormatter,
    ErrorLoggerService,
    UIErrorPresenter,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpErrorInterceptor,
      multi: true,
    },
    provideClientHydration(withEventReplay()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
