"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Artist } from "@/features/common/types/entity.type";
import { useDebounceValue } from "usehooks-ts";
import { getArtists } from "@/features/artists/api/client";

export type ArtistBasicInfo = {
  id: string;
  name: string;
};

type ArtistSelectProps = {
  value?: string;
  onChange: (value: string) => void;
  modal?: boolean;
  initialArtist?: Artist;
  onSelectArtist?: (artist: ArtistBasicInfo) => void;
};

export function ArtistSelect({
  value,
  onChange,
  initialArtist,
  onSelectArtist,
  modal = false,
}: ArtistSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const [debounceQuery] = useDebounceValue(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["artists-search", debounceQuery],
    queryFn: () =>
      getArtists({
        q: debounceQuery,
        take: 10,
      }),
    placeholderData: keepPreviousData,
    enabled: open,
  });

  const selectedArtist = data?.data.find((artist) => artist.id === value);

  const displayLabel = selectedArtist
    ? selectedArtist.name
    : value
    ? "Selected Artist"
    : "Select artist...";

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {/* Hiển thị avatar nhỏ nếu xịn */}
          <span className="truncate">{displayLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search artist name..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {isLoading && (
              <div className="py-6 text-center text-sm text-muted-foreground flex justify-center items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Searching...
              </div>
            )}

            {!isLoading && data?.meta.itemCount === 0 && (
              <CommandEmpty>No artist found.</CommandEmpty>
            )}

            <CommandGroup>
              {data?.data.map((artist) => (
                <CommandItem
                  key={artist.id}
                  value={artist.id}
                  onSelect={() => {
                    onChange(artist.id);
                    setOpen(false);

                    if (onSelectArtist) {
                      onSelectArtist({ id: artist.id, name: artist.name });
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === artist.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{artist.name}</span>
                    {/* Hiển thị thêm thông tin phụ để dễ chọn */}
                    <span className="text-xs text-muted-foreground">
                      {artist.followersCount?.toLocaleString()} followers
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
