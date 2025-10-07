import { RESPONSIVE_CONFIG } from "@/lib/config/responsive-config";
import { useState, useEffect } from "react";

export const useResponsiveLimit = () => {
  const [limit, setLimit] = useState<number>(RESPONSIVE_CONFIG.lg.cols);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      for (const key of Object.keys(RESPONSIVE_CONFIG)) {
        const bp = RESPONSIVE_CONFIG[key as keyof typeof RESPONSIVE_CONFIG];
        if (width >= bp.min && width <= bp.max) {
          setLimit(bp.cols);
          break;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return limit;
};
