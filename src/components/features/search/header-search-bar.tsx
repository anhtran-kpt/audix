"use client";

import { SearchIcon } from "lucide-react";
import { IconButton } from "../../ui/icon-button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const HeaderSearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(initialQuery);
  const debounced = useDebounce(value, 400);
  const router = useRouter();

  useEffect(() => {
    const q = debounced.trim();

    if (!q) {
      if (pathname.startsWith("/search")) {
        router.push("/");
      }
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("q", q);

    if (pathname.startsWith("/search")) {
      router.push(`/search?${params.toString()}`);
    } else {
      router.push(`/search?${params.toString()}`);
    }
  }, [debounced, router, searchParams, pathname]);

  return (
    <div className="grid w-sm items-center gap-3 relative">
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
        className="pl-10 rounded-full"
        value={value}
        autoCorrect="off"
        autoComplete="off"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
