import { Component } from "@angular/core";

import { LayoutComponent } from "../../shared/components";
import { ChatContainerComponentModule } from "../../shared/components/chat/chat-container/chat-container.component.module";

@Component({
  templateUrl: "./home.page.component.html",
  imports: [LayoutComponent, ChatContainerComponentModule],
  standalone: true,
})
export class HomePageComponent {}
