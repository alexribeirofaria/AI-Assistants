import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePageComponent } from '../pages/home/home.page.component';
import { PageNotFoundComponent } from '../pages/not-found/not-found.page.component';
import { PrivacyComponent } from '../pages/privacy/privacy.page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'register', redirectTo: '/privacy', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
