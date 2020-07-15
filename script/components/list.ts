import { ListComponentConfig } from "../../typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveList = (
  element: ListComponentConfig,
  pageId: string,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      header: ["string", "boolean", "undefined"],
      content: "array",
      footer: ["string", "undefined"]
    },
    location
  );

  element.content.forEach((listItem) => {
    if (listItem.path)
      if (listItem.path.startsWith("/"))
        listItem.path = listItem.path
          .replace(/^\//u, "")
          .replace(/\/$/u, "/index");
      else {
        const paths = pageId.split("/");
        paths.pop();

        listItem.path = `${paths.join("/")}/${listItem.path.replace(
          /\/$/u,
          "/index"
        )}`;
      }

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
