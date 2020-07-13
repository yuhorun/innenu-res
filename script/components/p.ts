import { checkKeys } from "../assertType";

export interface PComponentConfig {
  tag: "p";
  text: string | string[];
  style?: string;
  align?: string;
  src?: string;
  desc?: string;
  res?: string;
  imgmode?: string;
  downloadable?: boolean;
}

export const resolveP = (element: PComponentConfig, location = ""): void => {
  if (element.align)
    element.align = ["left", "right", "center", "justify"].includes(
      element.align
    )
      ? `text-align: ${element.align};`
      : "";

  checkKeys(
    element,
    {
      tag: "string",
      title: ["string", "boolean", "undefined"],
      text: "string",
      style: ["string", "Record<string,string>", "undefined"],
      align: ["string", "undefined"],
      desc: ["string", "undefined"]
    },
    location
  );
};
