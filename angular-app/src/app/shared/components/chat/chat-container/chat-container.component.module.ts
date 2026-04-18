import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ChatModule } from "../chat.module";
import { ChatContainerComponent } from "./chat-container.component";

@NgModule({
  declarations: [ChatContainerComponent],
  imports: [CommonModule, FormsModule, ChatModule],
  exports: [ChatContainerComponent, ChatModule],
})
export class ChatContainerComponentModule {}
