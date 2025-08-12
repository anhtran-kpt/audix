export const isExternalUrl = (s?: string | null) =>
  !!s && /^https?:\/\//i.test(s);
