"use client";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  MenuIcon,
} from "lucide-react";
import { HeaderSearchBar } from "./search/header-search-bar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { UserProfile } from "./user-profile";
import Link from "next/link";
import { HeaderButton } from "../shared/header-button";
import { useRouter } from "next/navigation";
import { useSidebar } from "../ui/sidebar";

export const Header = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const prevY = useRef(0);
  const router = useRouter();
  const { setOpenMobile, openMobile } = useSidebar();

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
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-(--header-height) w-full items-center justify-between px-responsive gap-responsive transition-transform duration-300 ease-in-out",
        "bg-transparent",
        isAtTop ? "" : "border-b bg-background/90 shadow-sm backdrop-blur-sm",
        isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"
      )}
    >
      <div className="flex items-center gap-4">
        <HeaderButton
          icon={ArrowLeftIcon}
          onClick={() => router.back()}
          className="hidden sm:inline-flex"
        />
        <HeaderButton
          icon={ArrowRightIcon}
          onClick={() => window.history.forward()}
          className="hidden sm:inline-flex"
        />
        <HeaderButton
          icon={MenuIcon}
          className="sm:hidden"
          onClick={() => setOpenMobile(!openMobile)}
        />
        <Link href="/" className="sm:hidden">
          <HeaderButton icon={HomeIcon} />
        </Link>
      </div>
      <div className="flex-1 flex justify-end sm:justify-center gap-4">
        <Link href="/" className="hidden sm:flex">
          <HeaderButton icon={HomeIcon} />
        </Link>
        <HeaderSearchBar />
      </div>
      <UserProfile />
    </header>
  );
};
