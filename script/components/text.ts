import { TextComponentConfig } from "../../types";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveText = (
  element: TextComponentConfig,
  location = ""
): void => {
  if (
    element.align &&
    ["left", "right", "center", "justify"].includes(element.align)
  )
    element.align = `text-align: ${element.align};` as
      | "text-align: left;"
      | "text-align: center;"
      | "text-align: right;"
      | "text-align: justify;";

  checkKeys(
    element,
    {
      tag: "string",
      heading: ["string", "boolean", "undefined"],
      text: ["string", "string[]", "undefined"],
      style: ["string", "Record<string,string>", "undefined"],
      align: ["string", "undefined"],
      src: ["string", "undefined"],
      desc: ["string", "undefined"]
    },
    location
  );
};
