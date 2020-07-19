import { readFileSync, writeFileSync } from "fs";
import { safeDump, safeLoad } from "js-yaml";
import { resolve } from "path";
import { getFileList } from "../util/file";

export const convertFolder = (
  sourceFolder: string,
  convertFunction: (data: any, filePath: string) => any
): void => {
  const fileList = getFileList(sourceFolder, "yml");

  fileList.forEach((filePath) => {
    const content = readFileSync(resolve(sourceFolder, filePath), {
      encoding: "utf-8",
    });
    const json = safeLoad(content);

    writeFileSync(
      resolve(sourceFolder, filePath),
      convertFunction(json, filePath),
      { encoding: "utf-8" }
    );
  });
};

// eslint-disable-next-line max-lines-per-function
const change = (json: any): any => {
  if (Array.isArray(json)) {
    const head = json.shift();

    const { title, desc, grey } = head;

    delete head.title;
    delete head.desc;
    delete head.grey;
    delete head.tag;

    const page: Record<string, any> = { title };

    if (desc) page.desc = desc;
    if (grey) page.grey = grey;
    if (head.display === false) {
      delete head.display;
      head.hidden = true;
    }

    // eslint-disable-next-line no-param-reassign
    json = { ...page, content: json, ...head };
  }

  // eslint-disable-next-line
  json.content.forEach((element: any, index: number) => {
    if (element.tag === "p") {
      delete element.tag;
      // eslint-disable-next-line no-param-reassign
      element = json.content[index] = { tag: "text", ...element };
    }

    if (element.tag === "text") {
      if (element.head !== undefined) {
        const heading = element.head;

        delete element.tag;
        delete element.head;
        // eslint-disable-next-line no-param-reassign
        element = json.content[index] = { tag: "text", heading, ...element };
      }

      if (element.title !== undefined) {
        const heading = element.title;

        delete element.tag;
        delete element.title;
        json.content[index] = { tag: "text", heading, ...element };
      }
    } else if (element.tag === "list") {
      if (element.head !== undefined) {
        const header = element.head;

        delete element.tag;
        delete element.head;
        // eslint-disable-next-line no-param-reassign
        element = json.content[index] = {
          tag: "list",
          header,
          ...element,
        };
      }

      if (element.heading !== undefined) {
        const header = element.heading;

        delete element.tag;
        delete element.heading;
        // eslint-disable-next-line no-param-reassign
        element = json.content[index] = {
          tag: "list",
          header,
          ...element,
        };
      }

      if (element.foot !== undefined) {
        const footer = element.foot;

        delete element.foot;
        // eslint-disable-next-line no-param-reassign
        element = json.content[index] = {
          ...element,
          footer,
        };
      }

      element.content.forEach((item: any) => {
        if (item.aim) item.path = item.aim;
        delete item.aim;
      });
    } else if (element.tag === "grid") {
      if (element.head !== undefined) {
        const header = element.head;

        delete element.tag;
        delete element.head;
        // eslint-disable-next-line no-param-reassign
        element = json.content[index] = { tag: "grid", header, ...element };
      }

      if (element.heading !== undefined) {
        const header = element.heading;

        delete element.tag;
        delete element.heading;
        // eslint-disable-next-line no-param-reassign
        element = json.content[index] = {
          tag: "list",
          header,
          ...element,
        };
      }

      if (element.foot !== undefined) {
        const footer = element.foot;

        delete element.foot;
        json.content[index] = { ...element, footer };
      }
    } else if (element.tag === "foot") {
      delete element.tag;
      json.content[index] = { tag: "footer", ...element };
    }
  });

  return safeDump(json, { lineWidth: 80 });
};

convertFolder("./res/guide", change);
convertFolder("./res/other", change);
convertFolder("./res/function/benbu", change);
convertFolder("./res/function/jingyue", change);
