import { execFileSync, execSync, spawn } from "child_process";
import { existsSync } from "fs";
import path, { join } from "path";

// ================================
// CONFIG
// ================================
const FrontendUrl = "http://localhost:4200";
const BackendUrl = "http://localhost:5000/health";

const root = process.cwd();
const backendPath = path.resolve(root, "../python-app");
const frontendPath = path.resolve(root, "../angular-app");

const isWin = process.platform === "win32";

// ================================
// SAFE BIN RESOLVER
// ================================
function bin(win: string, unix: string) {
  return isWin ? win : unix;
}

// ================================
// SAFE Ensure Npm Dependencies
// ================================

function ensureDependencies(): void {
  const nodeModulesPath = join(frontendPath, "node_modules");
  const packageLock = join(frontendPath, "package-lock.json");

  if (!existsSync(nodeModulesPath) || !existsSync(packageLock)) {
    console.log("📦 Instalando dependências (estado inconsistente)...");

    execFileSync("npm", ["install"], {
      cwd: frontendPath,
      stdio: "inherit"
    });

    return;
  }

  console.log("✔ Dependências OK");
}

// ================================
// UTIL: STOP PORT PROCESS
// ================================
function stopPortProcess(port: number) {
  try {
    const result = execSync(`netstat -ano | findstr :${port}`).toString();

    const pids = result
      .split("\n")
      .map((line) => line.trim().split(/\s+/).pop())
      .filter((pid) => pid && /^\d+$/.test(pid));

    const uniquePids = [...new Set(pids)];

    for (const pid of uniquePids) {
      if (!pid || pid === "0") continue;

      try {
        console.log(`🔪 Killing PID ${pid} on port ${port}`);
        execSync(`taskkill /PID ${pid} /T /F`);
      } catch {}
    }
  } catch {}
}

// ================================
// UTIL: STOP PROCESS TREE
// ================================
function stopProcessTree(pid?: number) {
  if (!pid) return;

  try {
    execSync(`taskkill /PID ${pid} /T /F`);
  } catch {}
}

// ================================
// WAIT HTTP
// ================================
function waitForHttp(url: string, timeoutSeconds = 120): Promise<void> {
  console.log(`⏳ Waiting: ${url}`);

  const start = Date.now();

  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(url);

        if (res.status >= 200 && res.status < 500) {
          console.log(`✅ Available: ${url}`);
          clearInterval(interval);
          resolve();
        }
      } catch {}

      if (Date.now() - start > timeoutSeconds * 1000) {
        clearInterval(interval);
        reject(new Error(`Timeout waiting ${url}`));
      }
    }, 2000);
  });
}

// ================================
// MAIN
// ================================
async function main() {
  console.log("🧹 Pre-cleanup: freeing ports...");
  stopPortProcess(4200);
  stopPortProcess(5000);
  await new Promise((r) => setTimeout(r, 2000));

  ensureDependencies();
  console.log("🚀 Starting E2E...");

  // ================================
  // BACKEND
  // ================================
  console.log("🖥️ Starting Backend...");

  const backend = spawn(bin("py", "python3"), ["main.py", "--app", "web"], {
    cwd: backendPath,
    stdio: "ignore",
    shell: false,
  });

  // ================================
  // FRONTEND (FIX DEFINITIVO)
  // ================================
  console.log("🌐 Starting Frontend...");

  const frontend = spawn(
    bin("cmd /c npm run start:silent", "npm run start:silent"),
    {
      cwd: frontendPath,
      stdio: "ignore",
      shell: true,
    },
  );
  let testFailed = false;

  try {
    await waitForHttp(BackendUrl, 120);
    await waitForHttp(FrontendUrl, 120);

    console.log("🧪 Running E2E tests...");

    
    execSync(
      "npx playwright test",
      {
        cwd: frontendPath,
        stdio: "inherit"
      }
    );
    
    console.log("✅ Tests finished successfully");
  } catch (err: any) {
    console.error("❌ ERROR:", err.message);
    testFailed = true;
  } finally {
    console.log("🧹 Final cleanup...");

    stopProcessTree(backend?.pid);
    stopProcessTree(frontend?.pid);

    stopPortProcess(4200);
    stopPortProcess(5000);

    console.log("✅ Cleanup completed");
  }

  process.exit(testFailed ? 1 : 0);
}

// ================================
main();
