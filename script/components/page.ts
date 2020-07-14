import {
  DocComponentConfig,
  PageConfig,
  TextComponentConfig,
  TitleComponentConfig,
  FooterComponentConfig,
  ListComponentConfig
} from "../../types";
import { checkKeys } from "@mr-hope/assert-type";
import { resolveTitle } from "./title";
import { resolveDoc } from "./doc";
import { resolveText } from "./text";
import { resolveFooter } from "./footer";
import { resolveList } from "./list";
/**
 * 处理页面数据
 *
 * @param page 页面数据
 * @param pageName 页面名称
 *
 * @returns 处理之后的page
 */
export const resolvePage = (page: PageConfig, pageName = ""): PageConfig => {
  page.images = [];

  checkKeys(
    page,
    {
      title: "string",
      desc: ["string", "undefined"],
      grey: ["boolean", "undefined"],
      content: "object[]",
      shareable: ["boolean", "undefined"],
      feedback: ["boolean", "undefined"],
      contact: ["boolean", "undefined"],
      images: "string[]"
    },
    `${pageName} page`
  );

  page.content.forEach((element, index) => {
    // 处理图片
    if ("src" in element)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      page.images!.push(element.res || element.src);

    if (element.tag === "title")
      resolveTitle(
        element as TitleComponentConfig,
        `${pageName} page.content[${index}]`
      );
    else if (element.tag === "p")
      resolveText(
        element as TextComponentConfig,
        `${pageName} page.content[${index}]`
      );
    // 设置文档
    else if (element.tag === "doc")
      resolveDoc(
        element as DocComponentConfig,
        `${pageName} page.content[${index}]`
      );
    // 设置列表组件
    else if (element.tag === "list" || element.tag === "ex-list")
      resolveList(
        element as ListComponentConfig,
        page.id,
        `${pageName} page.content[${index}]`
      );
    // 设置页脚
    else if (element.tag === "footer")
      resolveFooter(
        element as FooterComponentConfig,
        `${pageName} page.content[${index}]`
      );
  });

  return page; // 返回处理后的 page
};
