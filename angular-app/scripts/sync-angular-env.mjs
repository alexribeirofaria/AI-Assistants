import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const rootEnvPath = path.join(rootDir, ".env");
const angularEnvPath = path.join(rootDir, "angular-app", ".env");
const outputPath = path.join(
  rootDir,
  "angular-app",
  "src",
  "environments",
  ".env.ts"
);

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const result = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    result[key] = value;
  }
  return result;
};

const rootEnv = parseEnvFile(rootEnvPath);
const localEnv = parseEnvFile(angularEnvPath);
const merged = { ...rootEnv, ...localEnv };

const environment = {
  production: false,
  BASE_URL: merged.BASE_URL ?? "/api",
  LLM_CLAUDE_API_KEY: merged.LLM_CLAUDE_API_KEY ?? "",
  LLM__OPEN_API_KEY: merged.LLM__OPEN_API_KEY ?? "",
  LLM__GEMINI_API_KEY: merged.LLM__GEMINI_API_KEY ?? "",
  LLM__GROQ_API_KEY: merged.LLM__GROQ_API_KEY ?? "",
  LLM__DEEPSEEK_API_KEY: merged.LLM__DEEPSEEK_API_KEY ?? "",
};

const fileContent = [
  "export const environment = {",
  `  production: ${environment.production},`,
  `  BASE_URL: ${JSON.stringify(environment.BASE_URL)},`,
  `  LLM_CLAUDE_API_KEY: ${JSON.stringify(environment.LLM_CLAUDE_API_KEY)},`,
  `  LLM__OPEN_API_KEY: ${JSON.stringify(environment.LLM__OPEN_API_KEY)},`,
  `  LLM__GEMINI_API_KEY: ${JSON.stringify(environment.LLM__GEMINI_API_KEY)},`,
  `  LLM__GROQ_API_KEY: ${JSON.stringify(environment.LLM__GROQ_API_KEY)},`,
  `  LLM__DEEPSEEK_API_KEY: ${JSON.stringify(environment.LLM__DEEPSEEK_API_KEY)},`,
  "};",
  "",
].join("\n");

fs.writeFileSync(outputPath, fileContent, "utf8");
console.log(`Arquivo gerado com herança opcional: ${outputPath}`);
