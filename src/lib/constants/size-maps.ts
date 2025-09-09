export const iconSizeMap = {
  xs: "size-3",
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
  xl: "size-7",
} as const;

export type IconSize = keyof typeof iconSizeMap;

export const coverImageSizeMap = {
  xs: "size-9",
  sm: "size-14",
  md: "size-40",
  lg: "size-48",
  xl: "size-56",
} as const;

export type CoverImageSize = keyof typeof coverImageSizeMap;

export const artistImageSizeMap = {
  xs: "size-7",
  sm: "size-9",
  md: "size-40",
  lg: "size-48",
  xl: "size-56",
} as const;

export type ArtistImageSize = keyof typeof artistImageSizeMap;
