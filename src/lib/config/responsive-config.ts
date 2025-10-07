export const RESPONSIVE_CONFIG = {
  sm: { min: 0, max: 639, cols: 2 },
  md: { min: 640, max: 1023, cols: 3 },
  lg: { min: 1024, max: 1279, cols: 4 },
  xl: { min: 1280, max: 1535, cols: 5 },
  "2xl": { min: 1536, max: Infinity, cols: 6 },
} as const;
