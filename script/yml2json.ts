import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { safeLoad } from "js-yaml";
import { dirname, resolve } from "path";
import { readDir } from "./file";

export const convertFolder = (
  sourceFolder: string,
  targetFolder = sourceFolder,
  convertFunction: (data: any, filePath: string) => any = (data): any => data
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
      JSON.stringify(convertFunction(json, filePath)),
      { encoding: "utf-8" }
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
