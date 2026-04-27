import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AIAssistantApp } from "../../../ddd-core/application";
import { ChatInputComponent } from "./chat-input/chat-input.component";
import { ChatListComponent } from "./chat-list/chat-list.component";
import { ChatListModelsComponent } from "./chat-list-models/chat-list-models.component";
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { ChatProviderComponent } from "./chat-provider/chat-provider.component";

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
  providers: [
    {
      provide: AIAssistantApp,
      useFactory: () => new AIAssistantApp(),
    },
  ],
})
export class ChatModule { }
