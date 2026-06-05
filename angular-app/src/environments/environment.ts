import { environment as env } from './.env';

const useEnv = true;

export const environment = useEnv
  ? env
  : {
  production: true,
  BASE_URL: "http://127.0.0.1:80",
  API_URL: "http://127.0.0.1:443",
  LLM_CLAUDE_API_KEY:'AI-KEY',
  LLM__OPEN_API_KEY:'AI-KEY',
  LLM__GEMINI_API_KEY:'AI-KEY',
  LLM__GROQ_API_KEY:'AI-KEY',
  LLM__DEEPSEEK_API_KEY:'AI-KEY'
};
