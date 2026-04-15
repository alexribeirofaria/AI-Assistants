import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-provider',
  standalone: false,
  templateUrl: './chat-provider.html',
  styleUrl: './chat-provider.scss',
})
export class ChatProviderComponent {
  @Input() providers: string[] = [];
  @Input() selectedProvider = '';
  @Output() providerChange = new EventEmitter<string>();

  onProviderChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.providerChange.emit(select.value);
  }
}
