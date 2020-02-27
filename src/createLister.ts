export type FileType = 'file' | 'folder';

export type FileEntry = {
  type: FileType;
  name: string;
};

export type Breadcrumb = {
  url: string,
  name: string
}

export const createLister = ({
  getFolderContent,
  resolvePath,
  joinPath,
  writeFile,
  createHTMLContent
}: {
  getFolderContent: (dir: string) => FileEntry[];
  resolvePath: (...args: any[]) => string;
  joinPath: (...args: any[]) => string;
  writeFile: (path: string, content: string) => void;
  createHTMLContent: (input: {files: FileEntry[], name: string, breadcrumbs: Breadcrumb[]}) => string
}) => {

  const createDirListing = ({
    rootDir,
    parents = [],
    name = 'root',
  }: {
    rootDir: string;
    parents?: string[];
    name?: string;
  }) => {
    const dirs: string[] = [];
    const files: FileEntry[] = [];
    const entries = getFolderContent(rootDir);
    entries.forEach(file => {
      if (file.name) {
        if (file.type === 'folder') {
          dirs.push(file.name);
          files.push(file);
        }
        if (file.type === 'file' && file.name !== 'index.html') {
          files.push(file);
        }
      }
    });

    const content = createHTMLContent({
      files,
      name,
      breadcrumbs: parents.map((name, index) => {
        const url = joinPath(
          ...['../'.repeat(parents.length - index), 'index.html'].filter(Boolean)
        );
        return {url: url, name: index === 0 ? 'root' : name};
      }),
    });

    writeFile(resolvePath(rootDir, 'index.html'), content);

    dirs.forEach(dir => {
      createDirListing({
        rootDir: resolvePath(rootDir, dir),
        parents: [...parents, name],
        name: dir,
      });
    });
  };
  return createDirListing;
};
