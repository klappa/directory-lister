import fs from 'fs';
import path from 'path';

type FileType = 'file' | 'folder';

type FileEntry = {
  type: FileType;
  name: string;
};

const createParentLink = (parent: string, index: number, parents: string[]) => {
  const newUrl = path.join(
    ...['../'.repeat(parents.length - index), 'index.html'].filter(Boolean)
  );
  return ` <a href="${newUrl}">${index === 0 ? 'root' : parent}/</a>`;
};

const createHTMLContent = ({
  files,
  parents,
  name = '',
}: {
  files: FileEntry[];
  parents: string[];
  name: string;
}) => {
  return `
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Files within ${name}/</title>
    <style>
      body {
        margin: 0;
        padding: 30px;
        background: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      main {
        max-width: 920px;
      }

      header {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      h1 {
        font-size: 18px;
        font-weight: 500;
        margin-top: 0;
        color: #000;
      }

      header h1 a,
      header h1 span {
        font-size: 18px;
        font-weight: 500;
        margin-top: 0;
        color: #000;
      }

      h1 i {
        font-style: normal;
      }

      ul {
        margin: 0 0 0 -2px;
        padding: 20px 0 0 0;
      }

      ul li {
        list-style: none;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
      }

      a {
        text-decoration: none;
      }

      ul a {
        color: #000;
        padding: 10px 5px;
        margin: 0 -5px;
        white-space: nowrap;
        overflow: hidden;
        display: block;
        width: 100%;
        text-overflow: ellipsis;
      }

      header a,
      header span {
        color: #0076FF;
        font-size: 11px;
        font-weight: 400;
        display: inline-block;
        line-height: 20px;
      }

      svg {
        height: 13px;
        vertical-align: text-bottom;
      }

      ul a::before {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        width: 24px;
        text-align: center;
        line-height: 12px;
      }

      ul a.file::before {
        content: url("data:image/svg+xml;utf8,<svg width='15' height='19' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M10 8C8.34 8 7 6.66 7 5V1H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V8h-4zM8 5c0 1.1.9 2 2 2h3.59L8 1.41V5zM3 0h5l7 7v9c0 1.66-1.34 3-3 3H3c-1.66 0-3-1.34-3-3V3c0-1.66 1.34-3 3-3z' fill='black'/></svg>");
      }

      ul a:hover {
        text-decoration: underline;
      }

      ul a.folder::before {
        content: url("data:image/svg+xml;utf8,<svg width='20' height='16' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M18.784 3.87a1.565 1.565 0 0 0-.565-.356V2.426c0-.648-.523-1.171-1.15-1.171H8.996L7.908.25A.89.89 0 0 0 7.302 0H2.094C1.445 0 .944.523.944 1.171v2.3c-.21.085-.398.21-.565.356a1.348 1.348 0 0 0-.377 1.004l.398 9.83C.42 15.393 1.048 16 1.8 16h15.583c.753 0 1.36-.586 1.4-1.339l.398-9.83c.021-.313-.125-.69-.397-.962zM1.843 3.41V1.191c0-.146.104-.272.25-.272H7.26l1.234 1.088c.083.042.167.104.293.104h8.282c.125 0 .25.126.25.272V3.41H1.844zm15.54 11.712H1.78a.47.47 0 0 1-.481-.46l-.397-9.83c0-.147.041-.252.125-.356a.504.504 0 0 1 .377-.147H17.78c.125 0 .272.063.377.147.083.083.125.209.125.334l-.418 9.83c-.021.272-.23.482-.481.482z' fill='black'/></svg>");
      }

      ::selection {
        background-color: #79FFE1;
        color: #000;
      }

      ::-moz-selection {
        background-color: #79FFE1;
        color: #000;
      }

      @media (min-width: 768px) {
        ul {
          display: flex;
          flex-wrap: wrap;
        }
        ul li {
          width: 230px;
          padding-right: 20px;
        }
      }

      @media (min-width: 992px) {
        body {
          padding: 45px;
        }
        h1,
        header h1 a,
        header h1 span {
          font-size: 15px;
        }
        ul li {
          font-size: 13px;
          box-sizing: border-box;
          justify-content: flex-start;
        }
      }
    </style>
  </head>

  <body>
    <main>
      <header>
        <h1><i>Index of</i>${parents
          .map(createParentLink)
          .join('')} <span>${name}/</span></h1>
      </header>
      <ul id="files">
        ${
          parents.length > 0
            ? `<li><a href="../index.html" class="folder">../</a></li>`
            : ''
        }
        ${files
          .sort((a, b) => (a.name < b.name ? -1 : 1))
          .map(entry => {
            switch (entry.type) {
              case 'folder':
                return `<li><a href="${entry.name}/index.html" title="${entry.name}/" class="folder">${entry.name}/</a></li>`;
              case 'file':
                return `<li><a href="${entry.name}" title="${entry.name}" download target="_blank" class="file">${entry.name}</a></li>`;
            }
          })
          .join('')}
      </ul>
    </main>
  </body>
</html>`;
};

export const createDirListing = ({
  rootDir,
  parents = [],
  name = 'root',
}: {
  rootDir: string;
  parents?: string[];
  name?: string;
}) => {
  const entries = fs.readdirSync(rootDir);
  const dirs: string[] = [];
  const files: FileEntry[] = [];
  entries.forEach(name => {
    const stats = fs.lstatSync(path.resolve(rootDir, name));
    if (stats.isDirectory()) {
      dirs.push(name);
      files.push({ type: 'folder', name });
    }
    if (stats.isFile() && name !== 'index.html') {
      files.push({ type: 'file', name });
    }
  });

  const htmlContent = createHTMLContent({
    files,
    name,
    parents,
  });
  fs.writeFileSync(path.resolve(rootDir, 'index.html'), htmlContent);

  dirs.forEach(dir => {
    createDirListing({
      rootDir: path.resolve(rootDir, dir),
      parents: [...parents, name],
      name: dir,
    });
  });
};
