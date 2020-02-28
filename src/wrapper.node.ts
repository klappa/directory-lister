import fs from 'fs';
import path from 'path';

import { createLister, FileEntry } from './createLister';
import { createHTMLContent } from './createHTMLContent';

export const directoryLister = createLister({
  getFolderContent: dir =>
    fs.readdirSync(dir).reduce<FileEntry[]>((acc, name) => {
      const stats = fs.lstatSync(path.resolve(dir, name));
      if (stats.isDirectory()) {
        acc.push({ type: 'folder', name });
      }
      if (stats.isFile() && name !== 'index.html') {
        acc.push({ type: 'file', name });
      }
      return acc;
    }, []),
  createHTMLContent,
  joinPath: path.join,
  resolvePath: path.resolve,
  writeFile: (location, content) => {
    fs.writeFileSync(location, content);
  },
});
