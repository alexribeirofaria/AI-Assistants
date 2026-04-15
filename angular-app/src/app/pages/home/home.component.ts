import { Component, inject, OnInit, signal, effect, computed, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from '@ionic/angular';
import { ChatService } from '../../shared/services/chat/chat.service';
import { ChatState } from '../../shared/models/chat-state.model';
import { Subscription } from 'rxjs';
import { isNativeMobile } from "../../shared/utils/platform.utils";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  private platform = inject(Platform);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private chatState = inject(ChatState);

  messages = this.chatState.messages;
  isLoading = this.chatState.isLoading;
  error = this.chatState.error;

  private sendSub?: Subscription;

  ngOnInit(): void {
    this.platform.ready().then(() => {
      if (isNativeMobile()) {
        const elements = document.querySelectorAll('.g_signin');
        elements.forEach(el => el.remove());
      }
    });
  }

  ngOnDestroy(): void {
    this.sendSub?.unsubscribe();
  }

  onMessageSend(message: string) {
    if (this.isLoading()) return;
    
    this.sendSub = this.chatService.sendMessage(message).subscribe({
      next: () => console.log('Streaming completed'),
      error: (err) => {
        console.error('Chat error:', err);
        this.chatState.error.set('Erro na resposta');
        this.chatState.stopStreaming();
      }
    });
  }
}
