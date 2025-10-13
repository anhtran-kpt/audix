"use client";

import { HomeIcon } from "lucide-react";
import { HeaderSearchBar } from "./search/header-search-bar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AppNavigation } from "./app-navigation";
import { UserProfile } from "./user-profile";
import Link from "next/link";
import { HeaderButton } from "../shared/header-button";

export const Header = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const prevY = useRef(0);

  useEffect(() => {
    const el = document.getElementById("app-scroll");
    if (!el) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = el.scrollTop;
        setIsAtTop(y <= 0);

        const dy = y - prevY.current;
        if (dy > 0) setIsVisible(false);
        else if (dy < 0) setIsVisible(true);

        prevY.current = y;
        ticking = false;
      });
    };

    onScroll();
    el.addEventListener("scroll", onScroll, { passive: false });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky left-0 top-0 z-10 w-full h-(--header-height) flex items-center justify-between gap-4 lg:gap-6 py-3 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
        "transition-transform duration-300 ease-in-out bg-transparent",
        isAtTop ? "" : "border-b backdrop-blur-md shadow-sm bg-background/90",
        isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
      )}
    >
      <AppNavigation />
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center justify-center">
          <HeaderButton icon={HomeIcon} />
        </Link>
        <HeaderSearchBar />
      </div>
      <UserProfile />
    </header>
  );
};
