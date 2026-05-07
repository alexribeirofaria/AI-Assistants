import { Meta, StoryObj } from "@storybook/angular";
import { IMessage } from "../../../../../core/application/responses";
import { ChatMessageComponent } from "./chat-message.component";

type Story = StoryObj<ChatMessageComponent>;

// Fábrica de dados simples (segrega criação de dados - responsabilidade única)
class MessageFactory {
  static user(content = "Olá, isso é uma pergunta do usuário"): IMessage {
    return { id: "u-1", role: "user", content };
  }

  static assistant(
    content = "Resposta do assistente",
    provider?: string,
  ): IMessage {
    return { id: "a-1", role: "assistant", content, provider };
  }

  static streaming(provider?: string): IMessage {
    return {
      id: "a-2",
      role: "assistant",
      content: "",
      streaming: true,
      provider,
    };
  }

  static error(
    content = "Erro ao processar a requisição",
    provider?: string,
  ): IMessage {
    return { id: "e-1", role: "assistant", content, provider, type: "error" };
  }
}

export default {
  title: "Shared/Chat/ChatMessage",
  component: ChatMessageComponent,
  tags: ["autodocs"],
} as Meta<ChatMessageComponent>;

export const UserMessage: Story = {
  render: (args) => ({
    props: { ...args, message: MessageFactory.user() },
    template: `<app-chat-message [message]="message"></app-chat-message>`,
  }),
};

export const AssistantMessage: Story = {
  render: (args) => ({
    props: {
      ...args,
      message: MessageFactory.assistant(
        "Aqui está a resposta do assistente",
        "openai",
      ),
    },
    template: `<app-chat-message [message]="message"></app-chat-message>`,
  }),
};

export const StreamingMessage: Story = {
  render: (args) => ({
    props: { ...args, message: MessageFactory.streaming("gpt-provider") },
    template: `<app-chat-message [message]="message"></app-chat-message>`,
  }),
};

export const ErrorMessage: Story = {
  render: (args) => ({
    props: {
      ...args,
      message: MessageFactory.error(
        "Não foi possível completar a solicitação",
        "openai",
      ),
    },
    template: `<app-chat-message [message]="message"></app-chat-message>`,
  }),
};
