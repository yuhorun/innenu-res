import {
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync
} from "fs";
import { safeLoad } from "js-yaml";
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
  targetFolder = "./temp",
  convertFunction: (data: any, filePath: string) => any
): void => {
  const result = readDir("", sourceFolder);
  if (!existsSync(targetFolder)) mkdirSync(targetFolder, { recursive: true });

  result.file.forEach((filePath) => {
    const folderPath = dirname(resolve(targetFolder, filePath));
    if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true });

    const content = readFileSync(resolve(sourceFolder, filePath), {
      encoding: "utf-8"
    });
    const json = safeLoad(content);

    writeFileSync(
      resolve(targetFolder, filePath.replace(/\.yml/u, ".json")),
      JSON.stringify(convertFunction(json, filePath))
    );
  });

  if (result.dir.length !== 0)
    result.dir.forEach((dirPath) => {
      convertFolder(
        resolve(sourceFolder, dirPath),
        resolve(targetFolder, dirPath),
        convertFunction
      );
    });
};
