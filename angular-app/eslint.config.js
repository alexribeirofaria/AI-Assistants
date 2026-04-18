import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: "C:\\.dev\\AI-Assistants\\angular-app",
      },
    },
    plugins: {
      sonarjs,
      unicorn,
      import: importPlugin,
      "unused-imports": unusedImports,
      "@angular-eslint": angular,
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "no-duplicate-imports": "error",

      // =========================
      // 🧠 COMPLEXIDADE (SOLID)
      // =========================
      "max-lines-per-function": ["warn", 50],
      "max-depth": ["warn", 3],
      "complexity": ["warn", 10],

      // =========================
      // 📦 IMPORTS
      // =========================
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: false
          },
        },
      ],

      // =========================
      // 🧹 LIMPEZA
      // =========================
      "unused-imports/no-unused-imports": "error",

      // =========================
      // 🔒 TYPESCRIPT
      // =========================
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",

      // =========================
      // 🧠 QUALIDADE (Sonar)
      // =========================
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-duplicate-string": "warn",

      // =========================
      // 🦄 PADRÕES MODERNOS
      // =========================
      "unicorn/filename-case": [
        "warn",
        {
          case: "kebabCase",
        },
      ],

      // =========================
      // 🔥 ANGULAR
      // =========================
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },

  {
    files: ["**/*.html"],
    plugins: {
      "@angular-eslint/template": angularTemplate,
    },
    rules: {},
  },
];

