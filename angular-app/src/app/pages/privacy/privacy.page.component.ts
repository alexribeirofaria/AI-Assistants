import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  imports: [FooterComponent],
  standalone: true
})

export class PrivacyComponent {
}
