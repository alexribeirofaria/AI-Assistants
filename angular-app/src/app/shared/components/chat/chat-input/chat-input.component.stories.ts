import { Meta, StoryObj } from "@storybook/angular";
import { ChatInputComponent } from "./chat-input.component";

type Story = StoryObj<ChatInputComponent>;

export default {
  title: "Shared/Chat/ChatInput",
  component: ChatInputComponent,
  tags: ["autodocs"],
  args: {
    disabled: false,
  },
} as Meta<ChatInputComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      messageSend: (msg: string) => {
        // handler simples para Storybook: manter tipagem forte e separação de responsabilidades
        // aqui apenas logamos; em integração usaríamos uma action ou mock service
        // Mantemos comportamento puro: não mutamos args
        // eslint-disable-next-line no-console
        console.log("messageSend:", msg);
      },
    },
    template: `<app-chat-input [disabled]="disabled" (messageSend)="messageSend($event)"></app-chat-input>`,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    props: {
      ...args,
      messageSend: (msg: string) => {
        // nunca será chamado quando disabled === true, mas definimos a assinatura
        // eslint-disable-next-line no-console
        console.log("should not send when disabled:", msg);
      },
    },
    template: `<app-chat-input [disabled]="disabled" (messageSend)="messageSend($event)"></app-chat-input>`,
  }),
};
