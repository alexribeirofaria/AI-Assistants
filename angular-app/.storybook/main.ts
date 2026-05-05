import type { StorybookConfig } from "@storybook/angular";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: "@storybook/angular",
  env: (config) => ({
    ...config,
    NODE_ENV: "development",
  }),
};
export default config;
