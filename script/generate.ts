import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { type } from "os";
import { convertFolder } from "./yml2json";
import { resolvePage } from "./components/page";
import { generateKeywords } from "./keyword";

// 生成对应的 JSON
convertFolder("./res/config", "./resource/config");
convertFolder("./res/function", "./resource/function");
convertFolder("./res/guide", "./resource/guide", resolvePage);

// 生成关键词
generateKeywords();

// 读取旧版本号
const functionVersion = readFileSync(
  "./resource/functionVersion.json",
  "utf-8"
).trim();
const guideVersion = readFileSync(
  "./resource/guideVersion.json",
  "utf-8"
).trim();

// 更新 function 版本号
writeFileSync(
  "./resource/functionVersion.json",
  `${Number(functionVersion) + 1}\n`
);

// 更新 guide 版本号
writeFileSync("./resource/guideVersion.json", `${Number(guideVersion) + 1}\n`);

// 压缩文件
if (type() === "Linux") {
  exec(
    "zip -r resource/function.zip resource/function resource/functionVersion.json"
  );
  exec("zip -r resource/guide.zip resource/guide resource/guideVersion.json");
} else if (type() === "Windows_NT") {
  exec('"lib/7z" a -r resource/function.zip @lib/function');
  exec('"lib/7z" a -r resource/guide.zip @lib/guide');
} else throw new Error("Mac OS is not supported");
