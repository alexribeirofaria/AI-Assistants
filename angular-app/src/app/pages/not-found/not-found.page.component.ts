import { Component } from '@angular/core';

import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss'],
  imports: [FooterComponent],
  standalone: true
})
export class PageNotFoundComponent { }
