import { useState, useEffect } from "react";

export const useResponsiveLimit = (breakpoints = { sm: 2, md: 4, lg: 6 }) => {
  const [limit, setLimit] = useState(6);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 640) setLimit(breakpoints.sm);
      else if (width < 1024) setLimit(breakpoints.md);
      else setLimit(breakpoints.lg);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoints]);

  return limit;
};
