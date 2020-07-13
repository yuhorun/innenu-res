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

convertFolder("../res", (json) => {
  json.content.forEach((element: any, index: number) => {
    if (element.tag === "p" && element.head === false) {
      const title = element.head;

      delete element.tag;
      delete element.head;
      json.content[index] = { tag: "p", title, ...element };
    }
  });

  return safeDump(json, { lineWidth: 80 });
});
