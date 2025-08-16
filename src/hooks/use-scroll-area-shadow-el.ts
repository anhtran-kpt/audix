"use client";

import { useEffect, useState } from "react";

export function useScrollAreaShadowEl(el: HTMLElement | null) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!el) return;
    const vp = el.querySelector<HTMLElement>(
      "[data-radix-scroll-area-viewport]"
    );
    if (!vp) return;
    const onScroll = () => setScrolled(vp.scrollTop > 0);
    onScroll();
    vp.addEventListener("scroll", onScroll, { passive: false });
    return () => vp.removeEventListener("scroll", onScroll);
  }, [el]);

  return scrolled;
}
