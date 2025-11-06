"use client";

import { useState, useEffect } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

interface BreakpointConfig {
  [key: string]: Breakpoint;
}

interface ColumnVisibilityResult {
  [key: string]: boolean;
}

const BREAKPOINTS: Record<Breakpoint, string> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
} as const;

export function useResponsiveColumnVisibility(
  config: BreakpointConfig
): ColumnVisibilityResult {
  const [visibility, setVisibility] = useState<ColumnVisibilityResult>(() => {
    const initialState: ColumnVisibilityResult = {};
    Object.keys(config).forEach((column) => {
      initialState[column] = false;
    });
    return initialState;
  });

  useEffect(() => {
    const uniqueBreakpoints = new Set(Object.values(config));
    const mediaQueries = new Map<Breakpoint, MediaQueryList>();

    uniqueBreakpoints.forEach((breakpoint) => {
      const query = BREAKPOINTS[breakpoint];
      mediaQueries.set(breakpoint, window.matchMedia(query));
    });

    const updateVisibility = () => {
      const newVisibility: ColumnVisibilityResult = {};

      Object.entries(config).forEach(([column, breakpoint]) => {
        const mediaQuery = mediaQueries.get(breakpoint);
        newVisibility[column] = mediaQuery?.matches ?? false;
      });

      setVisibility(newVisibility);
    };

    updateVisibility();

    const listeners: Array<() => void> = [];
    mediaQueries.forEach((mediaQuery) => {
      const listener = () => updateVisibility();
      mediaQuery.addEventListener("change", listener);
      listeners.push(() => mediaQuery.removeEventListener("change", listener));
    });

    return () => {
      listeners.forEach((removeListener) => removeListener());
    };
  }, [config]);

  return visibility;
}
