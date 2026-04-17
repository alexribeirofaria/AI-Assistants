import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-chat-provider",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./chat-provider.component.html",
  styleUrl: "./chat-provider.component.scss",
})
  
export class ChatProviderComponent {
  @Input() providers: string[] = [];
  @Input() selectedProvider = "";
  @Output() providerChange = new EventEmitter<string>();
  
  onProviderSelected(value: string): void {
    if (value) {
      this.providerChange.emit(value);
    }
  }
}
