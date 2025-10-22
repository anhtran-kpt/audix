"use client";

import { useEffect, useState, useRef } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export const useResponsiveLimit = (options?: {
  itemMaxWidth?: number;
  itemGap?: number;
  containerSelector?: string;
}) => {
  const {
    itemMaxWidth = 256,
    itemGap,
    containerSelector = "section",
  } = options || {};

  const [limit, setLimit] = useState(5);
  const containerRef = useRef<HTMLElement | null>(null);
  const { state, isMobile } = useSidebar();

  useEffect(() => {
    if (containerSelector) {
      containerRef.current = document.querySelector(containerSelector);
    } else {
      containerRef.current = document.body;
    }

    const calcLimit = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;

      let currentGap = itemGap;

      if (currentGap === undefined) {
        const isXL = window.innerWidth >= 1280;
        currentGap = isXL ? 24 : 16;
      }

      const numItems = Math.ceil(
        (containerWidth + currentGap) / (itemMaxWidth + currentGap)
      );

      const bestNumItems = Math.max(1, Math.min(10, numItems));

      setLimit(bestNumItems);
    };

    calcLimit();

    const observer = new ResizeObserver(calcLimit);
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", calcLimit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calcLimit);
    };
  }, [itemMaxWidth, itemGap, state, isMobile, containerSelector]);

  return limit;
};
