import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ChatModule } from '../../shared/components/chat/chat.module';
import { ChatState } from '../../shared/models/chat-state.model';
import { ChatService } from '../../shared/services/chat/chat.service';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule,
    ChatModule
  ],
  providers: [ChatService, ChatState]
})
export class HomeModule { }


