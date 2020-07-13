const simpleAssetType = (variable: any, type: string): boolean => {
  if (type === "array") return Array.isArray(variable);
  if (type === "null") return variable === null;
  if (["number", "string", "boolean", "undefined"].includes(type))
    return typeof variable === type;
  if (type === "object")
    return (
      !Array.isArray(variable) &&
      variable !== null &&
      typeof variable === "object"
    );

  if (type.match(/.*\[\]/u)) {
    if (!Array.isArray(variable)) return false;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const itemType = /(.*)\[\]/u.exec(type)![1];

    return (
      variable.filter((item) => {
        if (typeof item === itemType) return false;

        console.error(`应为 ${type}，但元素出现了 ${typeof item}`);

        return typeof item !== itemType;
      }).length === 0
    );
  }

  if (type.match(/Record<(.*), ?(.*)>/u)) {
    if (
      Array.isArray(variable) ||
      typeof variable !== "object" ||
      variable === null
    )
      return false;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const keyType = /Record<(.*), ?(.*)>/u.exec(type)![1];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const contentType = /Record<(.*), ?(.*)>/u.exec(type)![2];

    for (const key in variable) {
      if (typeof key !== keyType) {
        console.error(`应为 ${type}，但键出现了 ${typeof key}`);
        return false;
      }
      if (typeof variable[key] !== contentType) {
        console.error(`应为 ${type}，但值出现了 ${typeof variable[key]}`);
        return false;
      }
    }

    return true;
  }

  console.warn(`未知类型 ${type}`);

  return true;
};

export const assertType = (
  variable: unknown,
  type: string[] | string,
  variableName = ""
): boolean => {
  if (typeof type === "string") {
    if (simpleAssetType(variable, type)) return true;

    console.error(`${variableName} 应为 ${type}，但此处为 ${variable}`);

    return false;
  }

  if (Array.isArray(type)) {
    if (
      type.filter((typeItem) =>
        typeof typeItem === "string"
          ? simpleAssetType(variable, typeItem)
          : variable === typeItem
      ).length === 0
    ) {
      console.error(
        `${variableName} 应为 ${type.toString()}，但此处为 ${variable}`
      );

      return false;
    }

    return true;
  }

  if (type === true || type === false) {
    if (variable === type) return true;

    console.error(
      `${variableName} 应为 ${(type as boolean).toString()}，但此处为 ${variable}`
    );

    return false;
  }

  if (typeof type === "object")
    if ((type as { type: string; value: any[] }).type === "enum") {
      if ((type as { type: string; value: any[] }).value.includes(variable))
        return true;

      console.error(
        `${variableName} 应为 ${(type as {
          type: string;
          value: any[];
        }).value.join("、")} 中之一，但此处为 ${variable}`
      );

      return false;
    }

  console.error(`未知类型配置 ${type}`);

  return true;
};

export const checkKeys = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  obj: any,
  config: Record<string, any>,
  objName = ""
): boolean => {
  const configKeys = Object.keys(config);

  for (const key in obj) {
    if (config[key]) {
      if (assertType(obj[key], config[key], `${objName}.${key}`)) {
        configKeys.splice(configKeys.indexOf(key), 1);

        continue;
      }

      return false;
    }

    console.error(`${objName} 不应存在 ${key}`);

    return false;
  }

  const unfindKeys = configKeys.filter((key) => {
    const type = config[key];

    return typeof type === "string"
      ? type !== "undefined"
      : Array.isArray(type)
      ? type.filter((typeItem) => typeItem === "undefined").length === 0
      : true;
  });

  if (unfindKeys.length === 0) return true;

  console.error(`${objName} 未找到 ${unfindKeys.toString()}`);

  return false;
};
