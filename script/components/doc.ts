import { DocComponentConfig } from "../../typings";
import { checkKeys } from "@mr-hope/assert-type";

/**
 * 获得文档图标
 *
 * @param docName 文档名称
 */
const getDocIcon = (docName: string): string => {
  if (!docName) return "";

  const docType = docName.split(".").pop();

  return docType === "docx" || docType === "doc"
    ? "doc"
    : docType === "pptx" || docType === "ppt"
    ? "ppt"
    : docType === "xlsx" || docType === "xls"
    ? "xls"
    : docType === "jpg" || docType === "jpeg" || docType === "jfif"
    ? "jpg"
    : docType === "mp4" ||
      docType === "mov" ||
      docType === "avi" ||
      docType === "rmvb"
    ? "video"
    : docType === "pdf"
    ? "pdf"
    : docType === "png" || docType === "gif"
    ? docType
    : "document";
};

/** 获得文档名称 */
const getDocName = (docName = ""): string => docName.split(".").shift() || "";

export const resolveDoc = (
  element: DocComponentConfig,
  location = ""
): void => {
  element.icon = getDocIcon(element.name);
  element.name = getDocName(element.name);

  checkKeys(
    element,
    {
      tag: "string",
      icon: "string",
      name: "string",
      url: "string",
      downloadable: { type: ["undefined"], additional: [true] },
    },
    location
  );
};
