"use client";

import { useEffect, useState, useRef } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export const useResponsiveLimit = (
  elementRef: React.RefObject<HTMLElement | null>,
  options?: {
    itemMaxWidth?: number;
    itemGap?: number;
    containerSelector?: string;
  }
) => {
  const {
    itemMaxWidth = 240,
    itemGap,
    containerSelector = "section",
  } = options || {};

  const [limit, setLimit] = useState(5);
  const containerRef = useRef<HTMLElement | null>(null);
  const { state, isMobile } = useSidebar();

  useEffect(() => {
    if (elementRef?.current) {
      containerRef.current = elementRef?.current.closest(containerSelector);
    } else {
      containerRef.current = document.body;
    }

    const calcLimit = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const currentGap = itemGap ?? (window.innerWidth >= 1280 ? 24 : 16);

      const numItems = Math.ceil(
        (containerWidth + currentGap) / (itemMaxWidth + currentGap)
      );
      setLimit(Math.max(1, Math.min(10, numItems)));
    };

    calcLimit();

    const observer = new ResizeObserver(calcLimit);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", calcLimit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calcLimit);
    };
  }, [itemMaxWidth, itemGap, containerSelector, state, isMobile, elementRef]);

  return limit;
};
