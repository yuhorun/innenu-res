export type ImageMode =
  | "widthFix"
  | "scaleToFill"
  | "aspectFit"
  | "aspectFill"
  | "top"
  | "bottom"
  | "center"
  | "left"
  | "right"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right";

export interface TitleComponentConfig {
  tag: "title";
  /** 标题文字 */
  text: string;
  /** 标题 css 样式 */
  style: string;
}

export interface TextComponentConfig {
  tag: "text";
  /** 段落标题 */
  heading?: string | true;
  /** 段落文字 */
  text?: string | string[];
  /** 段落文字样式 */
  style?: string;
  /**
   * 段落对齐方式
   *
   * @default "left"
   */

  align?:
    | "text-align: left;"
    | "text-align: center;"
    | "text-align: right;"
    | "text-align: justify;";
  /** 图片路径 */
  src?: string;
  /** 图片描述文字 */
  desc?: string;
  /** 图片高清地址 */
  res?: string;
  /**
   * 图片显示模式
   *
   * @default "widthFix"
   */
  imgmode?: ImageMode;
}

export interface ImageComponentConfig {
  tag: "img";
  /** 图片的本地路径或在线网址 */
  src: string;
  /** 图片在服务器上的网址 */
  res?: string;
  /** 图片的描述文字 */
  desc?: string;
  /**
   * 图片懒加载
   *
   * @default true
   */
  lazy?: false;
  /**
   * 图片显示模式
   *
   * @default "widthFix"
   */
  imgmode?: ImageMode;
}

export interface BaseListComponentItemConfig {
  /** 列表单元的显示文字 */
  text: string;
  /** 列表图标的本地路径或在线网址 */
  icon?: string;
  /** 列表内容的描述 */
  desc?: string;
  /**
   * 隐藏该列表项
   *
   * @default false
   */
  hidden?: boolean;
}

export interface NormalListComponentItemConfig
  extends BaseListComponentItemConfig {
  /** 对应界面的文件路径 */
  path?: string;
  /** 列表指向的界面路径或短名称 */
  url?: string;
}

export interface ListComponentConfig {
  tag: "list";
  /** 列表标题 */
  heading?: string | false;
  /** 列表内容 */
  content: NormalListComponentItemConfig[];
  /** 列表页脚 */
  footer?: string;
}

export interface GridComponenntItemComfig {
  /** 网格文字 */
  text: string;
  /** 网格图标的在线路径或本地路径 */
  icon: string;
  /** 对应页面的文件路径 */
  path?: string;
  /** 对应页面界面的路径 */
  url?: string;
}

export interface GridComponentConfig {
  tag: "grid";
  heading?: string;
  content: GridComponenntItemComfig[];
  /** 网格页脚 */
  footer?: string;
}

export interface FooterComponentConfig {
  tag: "foot";
  /** 作者 */
  author?: string;
  /** 最后更新日期 */
  time?: string;
  /** 额外描述 */
  desc?: string;
}

export interface DocComponentConfig {
  tag: "doc";
  /** 文档名称 */
  docName: string;
  /** 文档图标 */
  docIcon: string;
  /** 文档地址 */
  url: string;
  /**
   * 文档是否可下载
   *
   * @default true
   */
  downloadable?: false;
}

export interface PhoneComponentConfig {
  tag: "phone";
  /** 联系人电话号码 */
  num: string;
  /** 联系人的名 */
  fName: string;
  /** 联系人的姓 */
  lName?: string;
  /** 联系人所在公司 */
  org?: string;
  /** 联系人的备注 */
  remark?: string;
  /** 联系人的工作电话 */
  workNum?: string;
  /** 联系人的昵称 */
  nickName?: string;
  /** 联系人头像图片路径(仅限本地路径) */
  head?: string;
  /** 联系人的微信号 */
  wechat?: string;
  /** 联系人的地址省份 */
  province?: string;
  /** 联系人的地址城市 */
  city?: string;
  /** 联系人的地址街道 */
  street?: string;
  /** 联系人的地址邮政编码 */
  postCode?: string;
  /** 联系人的职位 */
  title?: string;
  /** 联系人的公司电话 */
  hostNum?: string;
  /** 联系人的网站 */
  website?: string;
  /** 联系人的电子邮件 */
  email?: string;
  /** 联系人的住宅电话 */
  homeNum?: string;
}

export interface SwiperComponentConfig {
  tag: "swiper";
  /** swiper 展示的图片的在线网址或本地路径 */
  url?: string[];
  /** swiper 的类名 */
  class?: string;
  /** swiper 的样式 */
  style?: string;
  // TODO:
}

export type PageTag =
  | "title"
  | "text"
  | "img"
  | "list"
  | "footer"
  | "grid"
  | "intro"
  | "ex-list"
  | "doc"
  | "phone"
  | "media"
  | "swiper";

export type ComponentConfig =
  | TitleComponentConfig
  | TextComponentConfig
  | ImageComponentConfig
  | ListComponentConfig
  | GridComponentConfig
  | FooterComponentConfig
  | DocComponentConfig
  | PhoneComponentConfig
  | SwiperComponentConfig
  | Record<string, any>;

/** 页面配置 */
export interface PageConfig {
  /** 页面标题 */
  title: string;
  /** 页面描述 */
  desc?: string;
  /** 页面标识 */
  id: string;
  /** 是否是灰色背景 */
  grey?: boolean;
  /** 页面内容 */
  content: ComponentConfig[];
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
  /**
   * 是否隐藏导航栏
   */
  hidden?: boolean;
}
