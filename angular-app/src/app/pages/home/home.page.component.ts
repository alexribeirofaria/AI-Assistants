import { Component } from "@angular/core";
import { ChatContainerComponentModule } from "../../shared/components/chat/chat-container/chat-container.component.module";
import { LayoutComponent } from "../../shared/components";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.component.html",
  styleUrls: ["./home.page.component.scss"],
  imports: [LayoutComponent, ChatContainerComponentModule],
  standalone: true,
})
export class HomePageComponent {}
