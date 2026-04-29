import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./route/app.routing.module";
import { AlertModule } from "./shared/components/alert/alert.component.module";
import { ChatModule } from "./shared/components/chat/chat.module";
import { CookieConsentComponent } from "./shared/components/cookie-consent/cookie-consent.component";
import { LayoutComponent } from "./shared/components/layout/layout.component";
import { ERROR_LOG_WRITER, GlobalErrorHandlerService, GlobalHttpErrorInterceptor, LocalStorageErrorLogWriterService } from "../core/infrastructure/errors-handlers";

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
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpErrorInterceptor,
      multi: true,
    },
    {
      provide: ERROR_LOG_WRITER,
      useExisting: LocalStorageErrorLogWriterService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
