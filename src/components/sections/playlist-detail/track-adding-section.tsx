"use client";

import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";

export const TrackAddingSection = () => {
  return (
    <section>
      <h2 className="font-bold text-2xl select-none capitalize mb-2">
        Recommended
      </h2>
      <p className="text-muted-foreground text-[calc(13rem/16)]">
        Based on what&apos;s in this playlist
      </p>

      <div className="grid w-full max-w-sm items-center gap-3 relative mt-6">
        <Label
          htmlFor="header-search-bar"
          className="absolute top-1/2 -translate-y-1/2 left-3"
        >
          <IconButton icon={SearchIcon} />
        </Label>
        <Input
          type="search"
          id="header-search-bar"
          placeholder="Search for songs..."
          className="pl-10"
        />
      </div>
    </section>
  );
};
