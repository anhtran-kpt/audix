import { SearchIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";

export const HeaderSearchBar = ({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) => {
  const [value, setValue] = useState("");
  const debounced = useDebounce(value, 400);
  const router = useRouter();

  useEffect(() => {
    if (debounced.trim()) {
      router.push(`/search?q=${encodeURIComponent(debounced.trim())}`);
    }
  }, [debounced, router]);

  return (
    <div className="grid w-full max-w-md items-center gap-3 relative">
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
        className="pl-10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
