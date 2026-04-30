import { environment as env } from './.env';

const useEnv = false;

export const environment = useEnv
  ? env
  : {
    production: false,
    BASE_URL: "/api",
    LLM_CLAUDE_API_KEY: "",
    LLM__OPEN_API_KEY: "",
    LLM__GEMINI_API_KEY: "",
    LLM__GROQ_API_KEY: "",
    LLM__DEEPSEEK_API_KEY: ""
  };
