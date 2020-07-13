import { checkKeys } from "../assertType";

export interface DocComponentConfig {
  tag: "doc";
  docName: string;
  docIcon: string;
  url: string;
  downloadable?: boolean;
}

/**
 * 获得文档图标
 *
 * @param docName 文档名称
 */
const getDocIcon = (docName: string): string => {
  if (!docName) return "";

  const docType = docName.split(".").pop();

  return (
    "./icon/" +
    (docType === "docx" || docType === "doc"
      ? "doc"
      : docType === "pptx" || docType === "ppt"
      ? "ppt"
      : docType === "xlsx" || docType === "xls"
      ? "xls"
      : docType === "jpg" || docType === "jpeg"
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
      : "document") +
    ".svg"
  );
};

/** 获得文档名称 */
const getDocName = (docName = ""): string => docName.split(".").shift() || "";

export const resolveDoc = (
  element: DocComponentConfig,
  location = ""
): void => {
  element.docIcon = getDocIcon(element.docName);
  element.docName = getDocName(element.docName);

  checkKeys(
    element,
    {
      tag: "string",
      docIcon: "string",
      docName: "string",
      url: "string",
      downloadable: [true, "undefined"]
    },
    location
  );
};
