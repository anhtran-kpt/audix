export const RESPONSIVE_CONFIG = {
  mobile: { min: 0, max: 639, cols: 2 },
  sm: { min: 640, max: 767, cols: 3 },
  md: { min: 768, max: 1023, cols: 4 },
  lg: { min: 1024, max: 1279, cols: 5 },
  xl: { min: 1280, max: Infinity, cols: 6 },
} as const;
