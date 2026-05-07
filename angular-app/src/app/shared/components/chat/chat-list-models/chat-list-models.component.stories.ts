import { Meta, StoryObj } from "@storybook/angular";
import { IModelProvider } from "../../../../../core/application/responses";
import { ChatListModelsComponent } from "./chat-list-models.component";

type Story = StoryObj<ChatListModelsComponent>;

const models: IModelProvider[] = [
  { id: "m1", modelName: "gpt-4", provider: "openai" },
  { id: "m2", modelName: "gpt-3.5", provider: "openai" },
  { id: "m3", modelName: "claude-2", provider: "claude" },
];

export default {
  title: "Shared/Chat/ChatListModels",
  component: ChatListModelsComponent,
  tags: ["autodocs"],
  args: {
    models,
    selectedModel: "m1",
  },
} as Meta<ChatListModelsComponent>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      modelChange: (v: string) => {
        // eslint-disable-next-line no-console
        console.log("modelChange ->", v);
      },
    },
    template: `<app-chat-list-models [models]="models" [selectedModel]="selectedModel" (modelChange)="modelChange($event)"></app-chat-list-models>`,
  }),
};
