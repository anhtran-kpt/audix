export const iconSizeMap = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-7",
} as const;

export type IconSize = keyof typeof iconSizeMap;

export const imageSizeMap = {
  xs: "size-24",
  sm: "size-32",
  md: "size-40",
  lg: "size-48",
  xl: "size-56",
} as const;

export type ImageSize = keyof typeof imageSizeMap;
