import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss'],
  imports: [CommonModule] ,
  standalone: true
})

export class CookieConsentComponent implements OnInit {
  showBanner = false;

  public ngOnInit() {
    let consent: string | null = null;

    try {
      if (typeof localStorage !== 'undefined') {
        consent = localStorage.getItem('cookie-consent');
      }
    } catch {
      consent = null;
    }

    if (!consent) {
      this.showBanner = true;
    }
  }

  public acceptCookies = () =>  {
    localStorage.setItem('cookie-consent', 'accepted');
    this.showBanner = false;
  }

  public declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    this.showBanner = false;
  }
}
