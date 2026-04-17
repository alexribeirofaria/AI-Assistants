import { Component, Input, Output, EventEmitter } from "@angular/core";
import { IHomeModel } from "../../../models";
@Component({
  selector: "app-chat-list-models",
  standalone: true,
  templateUrl: "./chat-list-models.component.html",
  styleUrl: "./chat-list-models.component.scss",
})

export class ChatListModelsComponent {
  @Input() models: IHomeModel[] = [];
  @Input() selectedModel = "";
  @Output() modelChange = new EventEmitter<string>();

  onModelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.modelChange.emit(select.value);
  }
}
