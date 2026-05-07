import { Meta, StoryObj } from '@storybook/angular';
import { ChatProviderComponent } from './chat-provider.component';

type Story = StoryObj<ChatProviderComponent>;

export default {
  title: 'Shared/Chat/ChatProvider',
  component: ChatProviderComponent,
  tags: ['autodocs'],
  args: {
    providers: ['openai', 'gpt', 'claude'],
    selectedProvider: 'openai',
  },
} as Meta<ChatProviderComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      providerChange: (value: string) => {
        // Mantemos o princípio de única responsabilidade: story apenas reporta evento
        // eslint-disable-next-line no-console
        console.log('providerChange ->', value);
      },
    },
    template: `<app-chat-provider [providers]="providers" [selectedProvider]="selectedProvider" (providerChange)="providerChange($event)"></app-chat-provider>`,
  }),
};
