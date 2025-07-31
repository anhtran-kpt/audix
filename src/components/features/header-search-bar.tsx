import { SearchIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const HeaderSearchBar = () => {
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
        placeholder="Search for songs, playlists or albums..."
        className="pl-10"
      />
    </div>
  );
};
