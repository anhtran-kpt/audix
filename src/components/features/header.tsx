"use client";

import { ArrowLeftIcon, ArrowRight, SettingsIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { HeaderSearchBar } from "./header-search-bar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { AppNavigation } from "./app-navigation";

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

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgClasses = isAtTop ? "" : "backdrop-blur-md shadow-sm";
  const isBordered = !isAtTop && isVisible && "border-b";
  const transformClasses = isVisible ? "translate-y-0" : "-translate-y-full";

  return (
    <header
      className={cn(
        "fixed top-0 z-20 flex items-center justify-between gap-6 py-3 px-12 transform transition-transform duration-300 ease-in-out bg-background/90",
        open ? "left-64 w-[calc(100%-16rem)]" : "left-0 w-full",
        transformClasses,
        bgClasses,
        isBordered
      )}
    >
      <div className="flex items-center gap-8 grow">
        <AppNavigation />
        <HeaderSearchBar />
      </div>
      <div className="flex gap-8 items-center">
        <ModeToggle />
        <IconButton icon={SettingsIcon} tooltipContent="Settings" />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
