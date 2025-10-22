"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { IconButton } from "../../ui/icon-button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HeaderButton } from "@/components/shared/header-button";

export const HeaderSearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const queryFromUrl = searchParams.get("q") ?? "";
  const [value, setValue] = useState(queryFromUrl);
  const debounced = useDebounce(value, 400);
  const isSearchPage = pathname.startsWith("/search");
  const prevDebouncedRef = useRef(debounced);

  const userTypingRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    userTypingRef.current = true;
    setValue(e.target.value);
  };

  useEffect(() => {
    if (!isSearchPage) {
      setValue("");
    } else if (!userTypingRef.current) {
      setValue(queryFromUrl);
    }
  }, [isSearchPage, queryFromUrl]);

  useEffect(() => {
    const q = debounced.trim();
    const prevDebounced = prevDebouncedRef.current.trim();

    userTypingRef.current = false;

    if (q === prevDebounced) return;
    prevDebouncedRef.current = debounced;

    if (!q) {
      if (isSearchPage) router.push("/");
      return;
    }

    const params = new URLSearchParams();
    params.set("q", q);

    const currentType = searchParams.get("type");
    if (currentType) params.set("type", currentType);

    if (isSearchPage) router.replace(`/search?${params.toString()}`);
    else router.push(`/search?${params.toString()}`);
  }, [debounced, router, isSearchPage, searchParams]);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <HeaderButton icon={SearchIcon} />
        </SheetTrigger>

        <SheetContent side="top" className="p-4" aria-describedby={undefined}>
          <SheetHeader className="hidden">
            <SheetTitle>Search</SheetTitle>
          </SheetHeader>

          <div className="w-full flex items-center justify-between gap-4">
            <div className="relative w-full">
              <Label
                htmlFor="header-search-bar"
                className="absolute top-1/2 -translate-y-1/2 left-3"
              >
                <IconButton icon={SearchIcon} />
              </Label>

              <Input
                type="search"
                id="header-search-bar"
                placeholder="What do you want to listen to?"
                className="pl-10 rounded-full placeholder:text-sm"
                value={value}
                autoCorrect="off"
                autoComplete="off"
                onChange={handleChange}
              />
            </div>
            <SheetClose asChild>
              <IconButton icon={XIcon} />
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="relative w-sm lg:w-md">
      <Label
        htmlFor="header-search-bar"
        className="absolute top-1/2 -translate-y-1/2 left-3"
      >
        <IconButton icon={SearchIcon} />
      </Label>

      <Input
        type="search"
        id="header-search-bar"
        placeholder="What do you want to listen to?"
        className="pl-10 rounded-full placeholder:text-sm"
        value={value}
        autoCorrect="off"
        autoComplete="off"
        onChange={handleChange}
      />
    </div>
  );
};
