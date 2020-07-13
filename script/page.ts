import { assertType } from "./assertType";
import { resolveTitle, TitleComponentConfig } from "./components/title";
import { resolveDoc, DocComponentConfig } from "./components/doc";
import { resolveP, PComponentConfig } from "./components/p";

export type PageTag =
  | "head"
  | "title"
  | "p"
  | "img"
  | "list"
  | "foot"
  | "grid"
  | "intro"
  | "ex-list"
  | "doc"
  | "phone"
  | "media"
  | "swiper";

/** 页面配置 */
export interface PageConfig {
  /** 页面标题 */
  title?: string;
  /** 页面描述 */
  desc?: string;
  /** 页面内容 */
  content: Record<string, any>[];
  /** 页面图片 */
  images?: string[];
  /**
   * 是否可以使用小程序的界面分享
   *
   * @default false
   */
  shareable?: boolean;
  /**
   * 是否在分享弹出菜单中显示联系客服
   *
   * @default true
   */
  contact?: boolean;
  /**
   * 是否在分享弹出菜单中显示反馈页面
   *
   * @default true
   */
  feedback?: boolean;
}

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

  assertType(page, "object", "page");
  assertType(page.title, "string", "page.title");
  assertType(page.desc, ["string", "undefined"], "page.desc");
  assertType(page.content, "object[]", "page.content");
  assertType(page.shareable, ["boolean", "undefined"], "page.shareable");
  assertType(page.feedback, ["boolean", "undefined"], "page.feedback");
  assertType(page.contact, ["boolean", "undefined"], "page.contact");

  page.content.forEach((element, index) => {
    // 处理图片
    if (element.src)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      page.images!.push(element.res || element.src);

    if (element.tag === "title")
      resolveTitle(
        element as TitleComponentConfig,
        `${pageName} page.content[${index}]`
      );
    else if (element.tag === "p")
      resolveP(
        element as PComponentConfig,
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
      element.content.forEach((listElement: any) => {
        if ("aim" in listElement)
          listElement.aim = listElement.aim.replace(/\/$/u, "/index");
      });
  });

  return page; // 返回处理后的 page
};
