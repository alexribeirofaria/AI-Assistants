import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home.page.component';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { ChatModule } from '../../shared/components/chat/chat.module';

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    RouterModule,
    LayoutComponent,
    ChatModule
  ]
})
export class HomePageComponentModule { }
