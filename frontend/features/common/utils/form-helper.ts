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
