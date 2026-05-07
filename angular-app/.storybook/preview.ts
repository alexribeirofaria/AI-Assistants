import { importProvidersFrom } from "@angular/core";
import type { Preview } from "@storybook/angular";
import { applicationConfig } from "@storybook/angular";
import { ChatModule } from "../src/app/shared/components/chat/chat.module";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [importProvidersFrom(ChatModule)],
    }),
  ],
};

export default preview;
