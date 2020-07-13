import { readdirSync, readFileSync, writeFileSync } from "fs";

/** 生成关键词 */
export const generateKeywords = (): void => {
  /** 关键词列表 */
  const keywords = JSON.parse(readFileSync("./lib/keywords.json", "utf-8"));
  /** 文件夹列表 */
  const forderList = readdirSync("./page");

  // 写入关键词内容，读出 page 目录下的文件夹
  forderList.forEach((forder) => {
    // 关键词和更新日志无需处理
    if (forder !== "keywords.json" && forder !== "log") {
      /** 文件夹下文件列表 */
      const jsonList = readdirSync(`./page/${forder}`);

      // 开始处理每个文件列表
      jsonList.forEach((json) => {
        /** JSON 名称 */
        const jsonName = json.slice(0, -5);
        /** JSON 文件内容 */
        const jsonContent = readFileSync(`./page/${forder}/${json}`, "utf-8");
        /** 解析后的 JSON 对象 */
        const jsonObject = JSON.parse(jsonContent);

        // 生成对应页面的索引对象
        if (!keywords[jsonName]) keywords[jsonName] = {};

        // 生成标题和详情
        keywords[jsonName].title = jsonObject[0].title;
        keywords[jsonName].desc = [];

        // 将页面的标题写入搜索详情中
        jsonObject.forEach((element: any) => {
          if (element.tag === "title")
            keywords[jsonName].desc.push(element.text);
        });
      });
    }
  });

  // 检测关键词是否合理
  Object.keys(keywords).forEach((x) => {
    if (!keywords[x].title) {
      delete keywords[x];
      console.error(`Missing ${x}`);
    }
  });

  // 写入关键词列表
  writeFileSync("./page/keywords.json", JSON.stringify(keywords));
};
