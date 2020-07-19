import { readFileSync } from "fs";
import { getFileList } from "../util/file";
import { resolve } from "path";

const chineseREG = /[\u4E00-\u9FA5]/gu;

export const getWords = (path: string): number => {
  let words = 0;

  getFileList(path, ".json").forEach((filePath) => {
    const chineseWords = readFileSync(resolve(path, filePath), {
      encoding: "utf-8",
    }).match(chineseREG);

    if (chineseWords) words += chineseWords.length;
  });

  return words;
};

export const getGuideWords = (): number => getWords("./resource/guide");

export const getFunctionWords = (): number => getWords("./resource/function");
