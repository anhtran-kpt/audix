"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { RESPONSIVE_CONFIG } from "@/lib/config/responsive-config";
import { useState, useEffect } from "react";

export const useResponsiveLimit = () => {
  const [limit, setLimit] = useState<number>(RESPONSIVE_CONFIG.lg.cols);
  const { open, isMobile, state } = useSidebar();

  useEffect(() => {
    const calcLimit = () => {
      const width = window.innerWidth;

      let newLimit: number = RESPONSIVE_CONFIG.lg.cols;

      const keys = Object.keys(RESPONSIVE_CONFIG) as Array<
        keyof typeof RESPONSIVE_CONFIG
      >;

      for (const key of keys) {
        const bp = RESPONSIVE_CONFIG[key];
        if (width >= bp.min && width <= bp.max) {
          newLimit = bp.cols;
          break;
        }
      }

      if (!isMobile && state === "expanded") {
        newLimit -= 1;
      }

      setLimit(newLimit);
    };

    calcLimit();
    window.addEventListener("resize", calcLimit);
    return () => window.removeEventListener("resize", calcLimit);
  }, [open, isMobile, state]);

  console.log(isMobile);

  return limit;
};
