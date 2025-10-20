import { HomeIcon, LibraryIcon, SearchIcon, UserRoundIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex sm:hidden items-center justify-evenly py-2 bg-player">
      <div className="flex flex-col items-center gap-1">
        <HomeIcon />
        Home
      </div>
      <div className="flex flex-col items-center gap-1">
        <SearchIcon />
        Search
      </div>
      <div className="flex flex-col items-center gap-1">
        <LibraryIcon />
        Library
      </div>
      <div className="flex flex-col items-center gap-1">
        <UserRoundIcon />
        Account
      </div>
    </footer>
  );
};
