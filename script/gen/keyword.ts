import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { getFileList } from "../util/file";

interface KeywordItem {
  title: string;
  desc: string[];
  keywords?: string[];
}

// 写入关键词内容
const writeKeywords = (
  keywords: Record<string, KeywordItem>,
  folder = "./resource/guide"
): void => {
  const fileList = getFileList(folder, "json").filter(
    (filepath) => filepath !== "keywords.json"
  );

  fileList.forEach((filePath) => {
    const content = readFileSync(resolve(folder, filePath), {
      encoding: "utf-8",
    });
    const pageConfig = JSON.parse(content);
    const pathName = `${folder}/${filePath}`
      .replace("./", "")
      .replace("resource/guide/", "")
      .replace(".json", "");

    // 生成对应页面的索引对象
    keywords[pathName] = {
      ...keywords[pathName],
      title: pageConfig.title,
      desc: [],
    };

    // 将页面的标题写入搜索详情中
    pageConfig.content.forEach((element: any) => {
      if (element.tag === "title") keywords[pathName].desc.push(element.text);
    });
  });
};

/** 生成关键词 */
export const genKeywords = (): void => {
  console.log("开始生成关键词");
  /** 关键词列表 */
  const keywords: Record<string, KeywordItem> = JSON.parse(
    readFileSync("./lib/keywords.json", { encoding: "utf-8" })
  );

  writeKeywords(keywords);

  // 写入关键词列表
  writeFileSync("./resource/guide/keywords.json", JSON.stringify(keywords));

  console.log("关键词生成完成");
};
