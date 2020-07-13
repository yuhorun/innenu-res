const fs = require("fs");
const path = require("path");
const yaml2json = require("js-yaml");

const readDir = (dirPath, prefix = "") => {
  const files = fs.readdirSync(path.resolve(prefix, dirPath));
  const result = { file: [], dir: [] };
  files.forEach((file) => {
    const filePath = path.resolve(prefix, dirPath, file);

    if (fs.statSync(filePath).isFile()) result.file.push(file);
    else if (fs.statSync(filePath).isDirectory()) result.dir.push(file);
  });

  return result;
};

const convertFolder = (sourceFolder, targetFolder = "./temp") => {
  const result = readDir("", sourceFolder);
  if (!fs.existsSync(targetFolder))
    fs.mkdirSync(targetFolder, { recursive: true });
  console.log(result);
  result.file.forEach((filePath) => {
    const folderPath = path.dirname(targetFolder, filePath);
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath, { recursive: true });

    const content = fs.readFileSync(path.resolve(sourceFolder, filePath), {
      encoding: "utf-8"
    });
    const json = yaml2json.safeLoad(content);

    fs.writeFileSync(
      path.resolve(targetFolder, filePath.replace(/\.yml/u, ".json")),
      JSON.stringify(json)
    );
  });

  if (result.dir.length !== 0)
    result.dir.forEach((dirPath) => {
      convertFolder(
        path.resolve(sourceFolder, dirPath),
        path.resolve(targetFolder, dirPath)
      );
    });
};

module.exports = convertFolder;
