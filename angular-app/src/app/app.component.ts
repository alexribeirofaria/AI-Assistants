import { Component } from '@angular/core';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  providers: [],
  imports: [CookieConsentComponent, RouterModule],
})
export class AppComponent { }
