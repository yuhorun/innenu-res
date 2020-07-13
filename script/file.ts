import { readdirSync, statSync } from "fs";
import { resolve } from "path";

export interface ReadDirResult {
  file: string[];
  dir: string[];
}

export const readDir = (dirPath: string, prefix = ""): ReadDirResult => {
  const files = readdirSync(resolve(prefix, dirPath));
  const result: ReadDirResult = { file: [], dir: [] };
  files.forEach((file) => {
    const filePath = resolve(prefix, dirPath, file);

    if (statSync(filePath).isFile()) result.file.push(file);
    else if (statSync(filePath).isDirectory()) result.dir.push(file);
  });

  return result;
};
