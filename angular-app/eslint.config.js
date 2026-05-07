// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [{
  ignores: ["coverage/**", "node_modules/**", "**/*.html"],
}, js.configs.recommended, {
  files: ["**/*.ts"],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: process.cwd(),
      sourceType: "module",
    },
    globals: {
      afterEach: "readonly",
      beforeEach: "readonly",
      console: "readonly",
      describe: "readonly",
      document: "readonly",
      expect: "readonly",
      expectAsync: "readonly",
      it: "readonly",
      jasmine: "readonly",
      localStorage: "readonly",
      performance: "readonly",
      sessionStorage: "readonly",
      spyOn: "readonly",
      window: "readonly",
    },
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
  },
  rules: {
    "no-console": "warn",
    "no-debugger": "error",
    "no-duplicate-imports": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
}, ...storybook.configs["flat/recommended"]];
