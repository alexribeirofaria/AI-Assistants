import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IModelProvider } from "../../../../../core/application/responses";

@Component({
  selector: "app-chat-list-models",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./chat-list-models.component.html",
  styleUrl: "./chat-list-models.component.scss",
})

export class ChatListModelsComponent {
  @Input() models: IModelProvider[] = [];
  @Input() selectedModel = "";
  @Output() modelChange = new EventEmitter<string>();

  onModelSelected(value: string): void {
    if (value) {
      this.modelChange.emit(value);
    }
  }
}
