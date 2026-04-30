import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileErrorRepository {
  save(
    filePath: string,
    content: string,
    readFile: (path: string) => string | null,
    writeFile: (path: string, value: string) => void,
  ): void {
    const currentContent = readFile(filePath);
    if (currentContent?.includes(content)) {
      return;
    }

    const nextContent = currentContent
      ? `${currentContent.trimEnd()}\n\n---\n\n${content}`
      : content;

    writeFile(filePath, nextContent);
  }
}
