import { exec } from "child_process";
import { sync as del } from "del";
import { readFileSync, writeFileSync } from "fs";
import { type } from "os";
import { convertFolder } from "../util/yml2json";
import { resolvePage } from "../components/page";
import { generateKeywords } from "./keyword";

// 生成对应的 JSON
convertFolder("./res/config", "./resource/config", (data, filePath) =>
  filePath.match(/(function|guide|main)/u) ? resolvePage(data, filePath) : data
);
convertFolder("./res/function", "./resource/function");
convertFolder("./res/guide", "./resource/guide", resolvePage);

// 生成关键词
generateKeywords();

exec("git diff --name-status", (_err, gitDiffResult) => {
  // 功能配置有更新
  if (gitDiffResult.match(/resource\/function/u)) {
    del("./resource/function.zip");
    // 读取旧版本号
    const functionVersion = readFileSync("./resource/functionVersion.json", {
      encoding: "utf-8"
    }).trim();

    // 更新 function 版本号
    writeFileSync(
      "./resource/functionVersion.json",
      `${Number(functionVersion) + 1}\n`
    );

    // 压缩文件
    if (type() === "Linux")
      exec(
        "zip -r resource/function.zip resource/function resource/functionVersion.json"
      );
    else if (type() === "Windows_NT")
      exec(
        'cd ./resource && "../lib/7z" a -r function.zip "@../lib/function" && cd ..'
      );
    else throw new Error("Mac OS is not supported");
  }

  // 指南配置有更新
  if (gitDiffResult.match(/resource\/guide/u)) {
    del("./resource/guide.zip");
    const guideVersion = readFileSync(
      "./resource/guideVersion.json",
      "utf-8"
    ).trim();

    // 更新 guide 版本号
    writeFileSync(
      "./resource/guideVersion.json",
      `${Number(guideVersion) + 1}\n`
    );

    // 压缩文件
    if (type() === "Linux")
      exec(
        "zip -r resource/guide.zip resource/guide resource/guideVersion.json"
      );
    else if (type() === "Windows_NT")
      exec(
        'cd ./resource && "../lib/7z" a -r guide.zip "@../lib/guide" && cd ..'
      );
    else throw new Error("Mac OS is not supported");
  }
});
