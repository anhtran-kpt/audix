"use client";

import { SearchIcon } from "lucide-react";
import { IconButton } from "../../ui/icon-button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const HeaderSearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const queryFromUrl = searchParams.get("q") ?? "";
  const [value, setValue] = useState(queryFromUrl);
  const debounced = useDebounce(value, 400);
  const isSearchPage = pathname.startsWith("/search");
  const prevDebouncedRef = useRef(debounced);

  // 🧠 Dùng flag để phân biệt khi nào người dùng đang gõ
  const userTypingRef = useRef(false);

  // Khi input thay đổi -> đánh dấu user đang gõ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    userTypingRef.current = true;
    setValue(e.target.value);
  };

  // Khi user rời khỏi trang /search → clear input
  // Khi quay lại /search → khôi phục query từ URL
  useEffect(() => {
    if (!isSearchPage) {
      setValue("");
    } else if (!userTypingRef.current) {
      // chỉ sync từ URL khi user KHÔNG đang gõ
      setValue(queryFromUrl);
    }
  }, [isSearchPage, queryFromUrl]);

  useEffect(() => {
    const q = debounced.trim();
    const prevDebounced = prevDebouncedRef.current.trim();

    // reset typing flag sau mỗi lần debounce xong
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

    // Ở trang search thì replace (tránh flicker history)
    // Ở trang khác thì push
    if (isSearchPage) router.replace(`/search?${params.toString()}`);
    else router.push(`/search?${params.toString()}`);
  }, [debounced, router, isSearchPage, searchParams]);

  return (
    <div className="relative w-sm">
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
        onChange={handleChange}
      />
    </div>
  );
};
