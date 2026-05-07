import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

interface NodeFsModule {
  existsSync(path: string): boolean;
  mkdirSync(path: string, options?: { recursive?: boolean }): void;
  readFileSync(path: string, encoding: string): string;
  writeFileSync(path: string, value: string, encoding: string): void;
}

interface NodePathModule {
  dirname(path: string): string;
  resolve(...paths: string[]): string;
}

@Injectable({
  providedIn: 'root',
})
export class SsrErrorWriterService {
  private readonly logDirectory = '.log_erros';

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  canWrite(): boolean {
    return isPlatformServer(this.platformId);
  }

  resolveLogFile(fileName: string): string {
    const path = this.getPathModule();
    return path.resolve(process.cwd(), this.logDirectory, fileName);
  }

  read(filePath: string): string | null {
    if (!this.canWrite()) {
      return null;
    }

    try {
      const fs = this.getFsModule();
      if (!fs.existsSync(filePath)) {
        return null;
      }

      return fs.readFileSync(filePath, 'utf8');
    } catch {
      return null;
    }
  }

  write(filePath: string, content: string): void {
    if (!this.canWrite()) {
      return;
    }

    const fs = this.getFsModule();
    const path = this.getPathModule();
    const directory = path.dirname(filePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf8');
  }

  private getFsModule(): NodeFsModule {
    return this.requireNodeModule('fs') as NodeFsModule;
  }

  private getPathModule(): NodePathModule {
    return this.requireNodeModule('path') as NodePathModule;
  }

  private requireNodeModule(moduleName: string): unknown {
    const nonWebpackRequire = (globalThis as { __non_webpack_require__?: (name: string) => unknown }).__non_webpack_require__;
    if (typeof nonWebpackRequire === 'function') {
      return nonWebpackRequire(moduleName);
    }

    return eval('require')(moduleName) as unknown;
  }
}
