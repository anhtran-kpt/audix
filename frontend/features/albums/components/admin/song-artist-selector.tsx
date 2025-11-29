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
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ArtistBasicInfo, ArtistSelect } from "./artist-select";
import { ArtistTypeEnum } from "../../schemas/album-form.schema";

interface SongArtistSelectorProps {
  name: string;
  onArtistSelect?: (index: number, artist: ArtistBasicInfo) => void;
}

export function SongArtistSelector({
  name,
  onArtistSelect,
}: SongArtistSelectorProps) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
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
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1">
              <FormField
                control={control}
                name={`${name}.${index}.artistId`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ArtistSelect
                        value={field.value}
                        onChange={field.onChange}
                        onSelectArtist={(artist) => {
                          if (onArtistSelect) {
                            onArtistSelect(index, artist);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-[110px]">
              <FormField
                control={control}
                name={`${name}.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ArtistTypeEnum.options.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-red-500"
                onClick={() => remove(index)}
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
