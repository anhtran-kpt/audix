"use client";

import { ArrowLeftIcon, ArrowRight, SettingsIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { HeaderSearchBar } from "./header-search-bar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

export const Header = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollY = useRef(0);
  const { open } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      setIsAtTop(currentY < 10);

      if (currentY > prevScrollY.current && currentY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      prevScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-20 flex items-center justify-between gap-6 py-3 px-12 transform transition-transform duration-300 ease-in-out",
        open ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full",
        isVisible ? "translate-y-0 bg-white/80" : "-translate-y-full",
        isAtTop ? "bg-transparent" : "backdrop-blur-md shadow-sm"
      )}
    >
      <div className="flex items-center gap-8 grow">
        <div className="flex items-center gap-6">
          <IconButton icon={ArrowLeftIcon} />
          <IconButton icon={ArrowRight} />
        </div>
        <HeaderSearchBar />
      </div>
      <div className="flex gap-8 items-center">
        <IconButton icon={SettingsIcon} tooltipContent="Settings" />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
