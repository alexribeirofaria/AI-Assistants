import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ChatContainerComponent } from './chat-container.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { ChatListComponent } from '../chat-list/chat-list.component';
import { ChatProviderComponent } from '../chat-provider/chat-provider.component';
import { ChatListModelsComponent } from '../chat-list-models/chat-list-models.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';

// Importar interfaces para tipagem
import { IMessage, IModelProvider } from '../../../../../core/application/responses';

// Mock simples do ChatService respeitando interface usada pelo componente
@Injectable()
class MockChatService {
  async getProviders(): Promise<string[]> {
    return ['openai', 'claude'];
  }

  async getModels(provider?: string): Promise<{ models: IModelProvider[]; defaultModel?: string }> {
    const models: IModelProvider[] = [
      { id: 'm1', modelName: 'gpt-4', provider: 'openai' },
      { id: 'm2', modelName: 'claude-2', provider: 'claude' },
    ];
    return { models, defaultModel: models.find(m => m.provider === (provider || models[0].provider))?.id };
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    const map: Record<string, string> = { openai: 'm1', claude: 'm2' };
    return map[provider ?? 'openai'];
  }

  async changeProvider(_provider: string): Promise<void> {
    return;
  }

  async sendMessage(_message: string, _options?: { provider?: string; model?: string }): Promise<{ content: string; gatewayStatus?: string }> {
    return { content: 'Resposta simulada do assistente', gatewayStatus: 'OK' };
  }
}

type Story = StoryObj<ChatContainerComponent>;

export default {
  title: 'Shared/Chat/ChatContainer',
  component: ChatContainerComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        ChatInputComponent,
        ChatListComponent,
        ChatProviderComponent,
        ChatListModelsComponent,
        ChatMessageComponent,
      ],
      providers: [
        { provide: (window as any).ChatService || 'ChatService', useClass: MockChatService }, // fallback: Storybook fará injeção por tipo real no app; aqui garantimos o mock
      ],
      declarations: [ChatContainerComponent],
    }),
  ],
  tags: ['autodocs'],
} as Meta<ChatContainerComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<div style="max-width:900px;"><app-chat-container></app-chat-container></div>`,
  }),
};
