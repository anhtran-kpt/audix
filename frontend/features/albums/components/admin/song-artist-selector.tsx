"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form";
import { ArtistTypeEnum } from "../../schemas/album-form.schema";
import { ArtistSelect } from "./artist-select";

interface SongArtistSelectorProps {
  songIndex: number;
}

export function SongArtistSelector({ songIndex }: SongArtistSelectorProps) {
  const { control } = useFormContext();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `songs.${songIndex}.artists`,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium">Performing Artists</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 text-xs"
          onClick={() => append({ artistId: "", type: "FEATURED" })}
        >
          <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field, artistIndex) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1">
              <FormField
                control={control}
                name={`songs.${songIndex}.artists.${artistIndex}.artistId`}
                render={({ field }) => (
                  <ArtistSelect value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="w-[110px]">
              <FormField
                control={control}
                name={`songs.${songIndex}.artists.${artistIndex}.type`}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ArtistTypeEnum.options.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-red-500"
                onClick={() => remove(artistIndex)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
