import { Meta, StoryObj } from "@storybook/angular";
import { IMessage } from "../../../../../core/application/responses";
import { ChatListComponent } from "./chat-list.component";

type Story = StoryObj<ChatListComponent>;

const sampleMessages: IMessage[] = [
  { id: "1", role: "user", content: "Olá, quem é você?" },
  {
    id: "2",
    role: "assistant",
    content: "Sou um assistente de exemplo.",
    provider: "openai",
  },
  {
    id: "3",
    role: "assistant",
    content: "",
    streaming: true,
    provider: "openai",
  },
  { id: "4", role: "assistant", content: "Resposta finalizada." },
];

export default {
  title: "Shared/Chat/ChatList",
  component: ChatListComponent,
  tags: ["autodocs"],
  args: {
    messages: sampleMessages,
  },
} as Meta<ChatListComponent>;

export const Default: Story = {
  args: {
    messages: sampleMessages,
  },
  render: (args) => ({
    props: args,
    template: `<div style="max-width:600px; height:400px; border:1px solid #eee; display:flex; flex-direction:column;">
      <app-chat-list [messages]="messages"></app-chat-list>
    </div>`,
  }),
};
