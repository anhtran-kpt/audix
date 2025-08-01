"use client";

import { ArrowLeftIcon, ArrowRight, SettingsIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { HeaderSearchBar } from "./header-search-bar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Header = () => {
  return (
    <header className="sticky top-0 left-0 w-full bg-accent flex items-center justify-between gap-6 py-3 px-16">
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
