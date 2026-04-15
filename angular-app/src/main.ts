import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { platformBrowser } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

platformBrowser()
  .bootstrapModule(AppComponent)
  .catch(err => console.error(err));