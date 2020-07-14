import { GridComponentConfig } from "../../typings";
import { checkKeys } from "@mr-hope/assert-type";

export const resolveGrid = (
  element: GridComponentConfig,
  pageId: string,
  location = ""
): void => {
  checkKeys(
    element,
    {
      tag: "string",
      heading: ["string", "undefined"],
      content: "array",
      footer: ["string", "undefined"]
    },
    location
  );

  element.content.forEach((gridItem) => {
    if (gridItem.path)
      if (gridItem.path.startsWith("/"))
        gridItem.path = gridItem.path.replace(/^\//u, "");
      else {
        const paths = pageId.split("/");
        paths.pop();

        gridItem.path = `${paths.join("/")}/${gridItem.path.replace(
          /\/$/u,
          "/index"
        )}`;
      }

    checkKeys(
      gridItem,
      {
        text: "string",
        icon: ["string", "undefined"],
        path: ["string", "undefined"],
        url: ["string", "undefined"]
      },
      `${location}.content`
    );
  });
};