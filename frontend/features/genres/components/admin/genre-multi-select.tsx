"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { getGenres } from "../../api/client";
import { genreKeys } from "../../api/keys";

interface GenreMultiSelectProps {
  value?: string[];
  onChange: (value: string[]) => void;
  modal?: boolean;
}

export function GenreMultiSelect({
  value = [],
  onChange,
  modal = false,
}: GenreMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data: genres = [], isLoading } = useQuery({
    queryKey: genreKeys.all,
    queryFn: async () => {
      const res = await getGenres({ take: 50 });
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
  });

  const handleSelect = (genreId: string) => {
    const selected = new Set(value);
    if (selected.has(genreId)) {
      selected.delete(genreId);
    } else {
      selected.add(genreId);
    }
    onChange(Array.from(selected));
  };

  const handleRemove = (e: React.MouseEvent, genreId: string) => {
    e.stopPropagation();
    const newValue = value.filter((id) => id !== genreId);
    onChange(newValue);
  };

  const selectedGenres = genres.filter((g) => value.includes(g.id));

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-h-[40px] h-auto justify-between"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selectedGenres.length > 0 ? (
              selectedGenres.map((genre) => (
                <Badge variant="secondary" key={genre.id} className="mr-1 mb-1">
                  {genre.name}
                  <div
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                    onMouseDown={(e) => handleRemove(e, genre.id)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </div>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground font-normal">
                Select genres...
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search genre..." />
          <CommandList>
            {isLoading && <CommandEmpty>Loading genres...</CommandEmpty>}
            {!isLoading && genres.length === 0 && (
              <CommandEmpty>No genre found.</CommandEmpty>
            )}

            <CommandGroup className="max-h-64 overflow-auto">
              {genres.map((genre) => (
                <CommandItem
                  key={genre.id}
                  value={genre.name}
                  onSelect={() => handleSelect(genre.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(genre.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {genre.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
