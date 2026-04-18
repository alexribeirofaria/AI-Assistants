import { Component } from "@angular/core";
import { ChatContainerComponentModule } from "../../shared/components/chat/chat-container/chat-container.component.module";
import { LayoutComponent } from "../../shared/components";

@Component({
  templateUrl: "./home.page.component.html",
  imports: [LayoutComponent, ChatContainerComponentModule],
  standalone: true,
})
export class HomePageComponent {}
