import { join, resolve } from 'https://deno.land/std/path/mod.ts';
import { createLister, FileEntry } from './createLister.ts';
import { createHTMLContent } from './createHTMLContent.ts';
const { readDirSync, writeFileSync } = Deno;

export const directoryLister = createLister({
  getFolderContent: dir =>
    readDirSync(dir).reduce<FileEntry[]>((acc, entry) => {
      if (entry.isDirectory()) {
        acc.push({ type: 'folder', name: entry.name || '' });
      }
      if (entry.isFile() && entry.name !== 'index.html') {
        acc.push({ type: 'file', name: entry.name || '' });
      }
      return acc;
    }, []),
  createHTMLContent,
  joinPath: join,
  resolvePath: resolve,
  writeFile: (location, content) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    writeFileSync(location, data);
  },
});
