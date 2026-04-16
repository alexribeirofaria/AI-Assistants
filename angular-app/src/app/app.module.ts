import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./route/app.routing.module";
import { HomePageComponentModule } from "./pages/home/home.page.component.module";
import { ChatModule } from "./shared/components/chat/chat.module";
import { LayoutComponent } from "./shared/components/layout/layout.component";
import { CookieConsentComponent } from "./shared/components/cookie-consent/cookie-consent.component";
import { AlertModule } from "./shared/components/alert/alert.component.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    HomePageComponentModule,
    ChatModule,
    AlertModule,
    LayoutComponent,
    CookieConsentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
