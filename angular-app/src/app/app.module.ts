import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './route/app.routing.module';
import { HomePageComponentModule } from './pages/home/home.page.component.module';
import { AlertModule } from './shared/components/alert/alert.component.module';
import { ChatModule } from './shared/components/chat/chat.module';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDropdownModule,
    HomePageComponentModule,
    AlertModule,
    ChatModule,
    RouterModule,
    CookieConsentComponent
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }