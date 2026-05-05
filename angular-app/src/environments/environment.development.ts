import { environment as env } from "./.env";

const useEnv = true;

export const environment = useEnv
  ? env
  : {
      production: false,
      BASE_URL: "/api",
      API_URL: "http://127.0.0.1:5000",
      LLM__CLAUDE_API_KEY: "",
      LLM__OPEN_API_KEY: "",
      LLM__GEMINI_API_KEY: "",
      LLM__GROQ_API_KEY: "",
      LLM__DEEPSEEK_API_KEY: "",
    };
