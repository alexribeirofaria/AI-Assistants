import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IModel } from '../../../models';

@Component({
  selector: 'app-chat-list-models',
  standalone: false,
  templateUrl: './chat-list-models.html',
  styleUrl: './chat-list-models.scss',
})
export class ChatListModelsComponent {
  @Input() models: IModel[] = [];
  @Input() selectedModel = '';
  @Output() modelChange = new EventEmitter<string>();

  onModelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.modelChange.emit(select.value);
  }
}
