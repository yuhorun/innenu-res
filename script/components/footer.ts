import { FooterComponentConfig } from "../../types";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveFooter = (
  element: FooterComponentConfig,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      author: ["string", "undefined"],
      time: ["string", "undefined"],
      desc: ["string", "undefined"]
    },
    location
  );
};
