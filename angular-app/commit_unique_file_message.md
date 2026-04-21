# Skill: Commit por Arquivo com Mensagem Inteligente

**Arquivo:** `commit_unique_file_message.md`

## Objetivo

Automatizar commits granulares, com um commit por arquivo modificado e mensagem semântica baseada no tipo de alteração.

## Regras

- Cada arquivo modificado deve gerar um commit individual.
- A mensagem do commit deve refletir o conteúdo do diff.
- A execução deve usar `execSync(..., { cwd })` e não depender de shell chaining.
- O fluxo deve repetir correção, validação e commit até terminar com sucesso.

## Scripts do projeto

Este repositório expõe os seguintes comandos:

- `npm run lint:check`
- `npm run build`
- `npm run coverage`

## Fluxo sugerido

1. Obter arquivos alterados com `git diff --name-only`.
2. Ler o diff de cada arquivo com `git diff -- <arquivo>`.
3. Executar lint com `npm run lint:check`.
4. Se houver erros, corrigir e repetir.
5. Executar build com `npm run build`.
6. Executar coverage com `npm run coverage`.
7. Se tudo passar, fazer um commit por arquivo.

## Exemplo base

```ts
import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const APP_PATH = process.cwd();

function run(command: string): string {
  return execSync(command, {
    cwd: APP_PATH,
    encoding: "utf-8",
  }).trim();
}

function runSafe(command: string): boolean {
  try {
    execSync(command, {
      cwd: APP_PATH,
      stdio: "inherit",
    });
    return true;
  } catch {
    return false;
  }
}

function getChangedFiles(): string[] {
  const output = run("git diff --name-only");
  return output ? output.split("\n").filter(Boolean) : [];
}

function getFileStatus(file: string): string {
  const statusLine = run(`git status --porcelain -- "${file}"`);
  return statusLine ? statusLine[0] : "";
}

function resolveCommitType(status: string): { type: string; action: string } {
  switch (status) {
    case "A":
      return { type: "feat", action: "add" };
    case "M":
      return { type: "fix", action: "update" };
    case "D":
      return { type: "chore", action: "remove" };
    default:
      return { type: "chore", action: "update" };
  }
}

function commitFile(file: string): void {
  const status = getFileStatus(file);
  const { type, action } = resolveCommitType(status);
  const message = `${type}: ${action} ${file}`;

  run(`git add -- "${file}"`);
  run(`git commit -m "${message}"`);
}

function main(): void {
  const files = getChangedFiles();

  if (files.length === 0) {
    console.log("Nenhum arquivo alterado.");
    return;
  }

  while (true) {
    if (!runSafe("npm run lint:check")) continue;
    if (!runSafe("npm run build")) continue;
    if (!runSafe("npm run coverage")) continue;

    const coverageFile = join(APP_PATH, "coverage", "coverage-final.json");
    if (!existsSync(coverageFile)) continue;

    break;
  }

  files.forEach(commitFile);
}

main();
```

## Heurística de mensagem

- `feat`: quando houver adição de funcionalidade.
- `fix`: quando houver correção de comportamento ou ajuste em código existente.
- `refactor`: quando a alteração for principalmente estrutural.
- `chore`: quando a mudança for de configuração, limpeza ou remoção.
- `test`: quando o arquivo for de teste ou a alteração for focada em testes.
- `docs`: quando o arquivo for de documentação.

## Observação

Se o projeto evoluir, a heurística deve ser refinada para ler o diff e inferir a mensagem com mais precisão, em vez de depender apenas do status do arquivo.
