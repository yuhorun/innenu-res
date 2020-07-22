import { exec } from "child_process";
import { sync as del } from "del";
import { readFileSync, writeFileSync } from "fs";
import { type } from "os";
import { convertFolder } from "../util/yml2json";
import { resolvePage } from "../components/page";
import { genKeywords } from "./keyword";
// import { genSitemap } from "./sitemap";
import { genQRCode } from "./QRCode";
import { getGuideWords, getFunctionWords } from "./count";
import { pushPages } from "./push";

// 删除旧的文件
del(["./resource/function/**", "./resource/guide/**", "./resource/other/**"]);

// 生成对应的 JSON
convertFolder("./res/config", "./resource/config", (data, filePath) =>
  filePath.match(/(function|guide|main)/u) ? resolvePage(data, filePath) : data
);
convertFolder("./res/function", "./resource/function");
convertFolder("./res/guide", "./resource/guide", resolvePage);
convertFolder("./res/other", "./resource/other", resolvePage);

// 生成关键词
genKeywords();

// 生成 Sitemap
// genSitemap();

// 生成二维码
genQRCode()
  .then(() => pushPages())
  .then(() => {
    exec("git diff --name-status", (_err, gitDiffResult) => {
      // 功能配置有更新
      if (gitDiffResult.match(/resource\/function/u)) {
        del("./resource/function.zip");
        // 读取旧版本号
        const functionVersion = readFileSync(
          "./resource/functionVersion.json",
          {
            encoding: "utf-8",
          }
        ).trim();

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
      console.log(
        `东师指南现有字数 ${getGuideWords()} 字，功能部分现有字数 ${getFunctionWords()}字，共计 ${
          getGuideWords() + getFunctionWords()
        } 字。`
      );
    });
    console.log("全部完成");
  });
