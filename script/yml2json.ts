import fs from "fs";
import path from "path";
import { safeLoad } from "js-yaml";

interface ReadDirResult {
  file: string[];
  dir: string[];
}

const readDir = (dirPath: string, prefix = ""): ReadDirResult => {
  const files = fs.readdirSync(path.resolve(prefix, dirPath));
  const result: ReadDirResult = { file: [], dir: [] };
  files.forEach((file) => {
    const filePath = path.resolve(prefix, dirPath, file);

    if (fs.statSync(filePath).isFile()) result.file.push(file);
    else if (fs.statSync(filePath).isDirectory()) result.dir.push(file);
  });

  return result;
};

export const convertFolder = (
  sourceFolder: string,
  targetFolder = "./temp",
  convertFunction: (data: any, filePath: string) => any
): void => {
  const result = readDir("", sourceFolder);
  if (!fs.existsSync(targetFolder))
    fs.mkdirSync(targetFolder, { recursive: true });

  result.file.forEach((filePath) => {
    const folderPath = path.dirname(path.resolve(targetFolder, filePath));
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });

    const content = fs.readFileSync(path.resolve(sourceFolder, filePath), {
      encoding: "utf-8"
    });
    const json = safeLoad(content);

    fs.writeFileSync(
      path.resolve(targetFolder, filePath.replace(/\.yml/u, ".json")),
      JSON.stringify(convertFunction(json, filePath))
    );
  });

  if (result.dir.length !== 0)
    result.dir.forEach((dirPath) => {
      convertFolder(
        path.resolve(sourceFolder, dirPath),
        path.resolve(targetFolder, dirPath),
        convertFunction
      );
    });
};
