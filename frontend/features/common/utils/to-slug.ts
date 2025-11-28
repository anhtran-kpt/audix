import slugify from "slugify";

export const toSlug = (str: string): string => {
  return slugify(str, {
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
    replacement: "-",
  });
};
