import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../../pages/page-not-found/page-not-found.component';
import { PrivacyComponent } from '../../pages/privacy/privacy.component';
import { HomeComponent } from '../../pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'register', redirectTo: '/privacy', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
