import { checkKeys } from "../assertType";
import { resolveStyle } from "./utils";

export interface TitleComponentConfig {
  tag: "title";
  text: string;
  style: string | Record<string, string>;
}

export const resolveTitle = (
  element: TitleComponentConfig,
  location = ""
): void => {
  // 处理样式
  if (typeof element.style === "object")
    element.style = resolveStyle(element.style);

  checkKeys(
    element,
    {
      tag: "string",
      text: "string",
      style: ["string", "Record<string, string>", "undefined"]
    },
    location
  );
};
