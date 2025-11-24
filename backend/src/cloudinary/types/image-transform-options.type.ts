export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "scale" | "fit" | "thumb" | "pad";
  gravity?: "face" | "center" | "auto" | "north" | "south";
  quality?: string;
  format?: string;
}
