export const sanitizeNull = <T>(obj: T): T => {
  if (obj === null || obj === undefined) {
    return "" as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeNull) as any;
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, sanitizeNull(value)])
    ) as any;
  }

  return obj;
};

export function getDirtyValues<T>(
  dirtyFields: Record<string, any>,
  allValues: T
): Partial<T> {
  const dirtyValues: any = {};

  Object.keys(dirtyFields).forEach((key) => {
    if (dirtyFields[key] === true || typeof dirtyFields[key] === "object") {
      // @ts-ignore
      dirtyValues[key] = allValues[key];
    }
  });

  return dirtyValues;
}

export const emptyStringToNull = (val: string | null | undefined) =>
  typeof val === "string" && val.trim() === "" ? null : val;
