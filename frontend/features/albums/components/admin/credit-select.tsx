"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getArtists } from "../../../artists/api/client";
import { useDebounceValue } from "usehooks-ts";

interface CreditSelectProps {
  value?: { id?: string; name: string };
  onChange: (value: { id?: string; name: string }) => void;
}

export function CreditSelect({ value, onChange }: CreditSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounceValue(search, 300);

  const { data } = useQuery({
    queryKey: ["artists-search", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return { data: [] };
      return await getArtists({ q: debouncedSearch, take: 5 });
    },
    enabled: open,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value?.name || "Select or type name..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          {" "}
          <CommandInput
            placeholder="Search artist..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandGroup heading="Existing Artists">
              {data?.data.map((artist) => (
                <CommandItem
                  key={artist.id}
                  value={artist.id}
                  onSelect={() => {
                    onChange({ id: artist.id, name: artist.name });
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value?.id === artist.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {artist.name}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {search.length > 0 && (
              <CommandGroup heading="Custom Name">
                <CommandItem
                  onSelect={() => {
                    onChange({ name: search });
                    setOpen(false);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Use "{search}" as raw text
                </CommandItem>
              </CommandGroup>
            )}

            {!data?.data.length && !search && (
              <CommandEmpty>Type to search...</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
