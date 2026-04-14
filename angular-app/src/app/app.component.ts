import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookieConsentComponent } from './shared/components/cookie-consent/cookie-consent.component';
import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, CookieConsentComponent],
  providers: [AuthService]
})
export class AppComponent {
}
