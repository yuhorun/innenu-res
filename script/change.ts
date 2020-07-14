import {
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "fs";
import { safeDump, safeLoad } from "js-yaml";
import { dirname, resolve } from "path";

interface ReadDirResult {
  file: string[];
  dir: string[];
}

const readDir = (dirPath: string, prefix = ""): ReadDirResult => {
  const files = readdirSync(resolve(prefix, dirPath));
  const result: ReadDirResult = { file: [], dir: [] };
  files.forEach((file) => {
    const filePath = resolve(prefix, dirPath, file);

    if (statSync(filePath).isFile()) result.file.push(file);
    else if (statSync(filePath).isDirectory()) result.dir.push(file);
  });

  return result;
};

export const convertFolder = (
  sourceFolder: string,
  convertFunction: (data: any, filePath: string) => any
): void => {
  const result = readDir("", sourceFolder);

  result.file.forEach((filePath) => {
    const folderPath = dirname(resolve(sourceFolder, filePath));
    if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true });

    const content = readFileSync(resolve(sourceFolder, filePath), {
      encoding: "utf-8"
    });
    const json = safeLoad(content);

    writeFileSync(
      resolve(sourceFolder, filePath),
      convertFunction(json, filePath),
      { encoding: "utf-8" }
    );
  });

  if (result.dir.length !== 0)
    result.dir.forEach((dirPath) => {
      convertFolder(resolve(sourceFolder, dirPath), convertFunction);
    });
};

const change = (json: any): any => {
  if (Array.isArray(json)) {
    const head = json.shift();

    const { title, desc, grey } = head;

    delete head.title;
    delete head.desc;
    delete head.grey;

    const page: Record<string, any> = { title };

    if (desc) page.desc = desc;
    if (grey) page.grey = grey;

    // eslint-disable-next-line no-param-reassign
    json = { ...page, content: json, ...head };
  }

  // eslint-disable-next-line max-statements
  json.content.forEach((element: any, index: number) => {
    if (element.tag === "p") {
      delete element.tag;
      json.content[index] = { tag: "text", ...element };
    }

    if (element.tag === "text" && element.head !== undefined) {
      const heading = element.head;

      delete element.tag;
      delete element.head;
      json.content[index] = { tag: "text", heading, ...element };
    }

    if (element.tag === "text" && element.title !== undefined) {
      const heading = element.title;

      delete element.tag;
      delete element.title;
      json.content[index] = { tag: "text", heading, ...element };
    }

    if (element.tag === "list" && element.head !== undefined) {
      const heading = element.head;

      delete element.tag;
      delete element.head;
      json.content[index] = { tag: "list", heading, ...element };
    }

    if (element.tag === "list" && element.foot !== undefined) {
      const footer = element.foot;

      delete element.foot;
      json.content[index] = { ...element, footer };
    }

    if (element.tag === "grid" && element.head !== undefined) {
      const heading = element.head;

      delete element.tag;
      delete element.head;
      json.content[index] = { tag: "grid", heading, ...element };
    }

    if (element.tag === "grid" && element.foot !== undefined) {
      const footer = element.foot;

      delete element.foot;
      json.content[index] = { ...element, footer };
    }

    if (element.tag === "foot") {
      delete element.tag;
      json.content[index] = { tag: "footer", ...element };
    }
  });

  return safeDump(json, { lineWidth: 80 });
};

convertFolder("../res/guide", change);
convertFolder("../res/other", change);
