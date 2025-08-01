export const iconSizeMap = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-7",
} as const;

export type IconSize = keyof typeof iconSizeMap;

export const imageSizeMap = {
  xs: "size-12",
  sm: "size-16",
  md: "size-20",
  lg: "size-24",
  xl: "size-28",
} as const;

export type ImageSize = keyof typeof imageSizeMap;
