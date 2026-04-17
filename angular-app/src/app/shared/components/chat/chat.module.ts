import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChatProviderComponent } from "./chat-provider/chat-provider.component";
import { ChatListModelsComponent } from "./chat-list-models/chat-list-models.component";
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { ChatListComponent } from "./chat-list/chat-list.component";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatContainerComponent } from "./chat-container/chat-container.component";

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ChatProviderComponent,
    ChatListModelsComponent,
    ChatMessageComponent,
    ChatListComponent,
    ChatInputComponent,
  ],
  exports: [
    ChatProviderComponent,
    ChatListModelsComponent,
    ChatMessageComponent,
    ChatListComponent,
    ChatInputComponent
  ],
})
export class ChatModule { }
