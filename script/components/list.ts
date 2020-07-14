import { ListComponentConfig } from "../../types";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveList = (
  element: ListComponentConfig,
  _pageId: string,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      heading: ["string", "boolean", "undefined"],
      content: "array",
      footer: ["string", "undefined"]
    },
    location
  );

  element.content.forEach((listItem) => {
    if (listItem.path) listItem.path = listItem.path.replace(/\/$/u, "/index");

    checkKeys(
      listItem,
      {
        text: "string",
        icon: ["string", "undefined"],
        desc: ["string", "undefined"],
        path: ["string", "undefined"],
        url: ["string", "undefined"]
      },
      `${location}.content`
    );
  });
};
