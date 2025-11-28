"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlbumInfoValues,
  albumInfoSchema,
} from "@/features/albums/schemas/album-edit.schema";
import { uploadMedia } from "@/features/media/api/client";
import { compressImage } from "@/features/common/utils/compress-image";
import { ImageUpload } from "@/components/ui/image-load";
import { Input } from "@/components/ui/input";
import { ArtistSelect } from "../artist-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlbumTypeEnum } from "@/features/albums/schemas/album-form.schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { GenreMultiSelect } from "@/features/genres/components/admin/genre-multi-select";
import { useUpdateAlbum } from "@/features/albums/hooks/admin/use-update-album";
import { AlbumEntity } from "@/features/common/types/entity.type";

export function AlbumInfoForm({ initialData }: { initialData: AlbumEntity }) {
  const { updateAlbum, isUpdating } = useUpdateAlbum();

  const form = useForm<AlbumInfoValues>({
    resolver: zodResolver(albumInfoSchema),
    defaultValues: {
      title: initialData.title,
      artistId: initialData.artistId,
      type: initialData.type,
      genreIds: initialData.genres?.map((g) => g.genre?.id) || [],
      releaseDate: initialData.releaseDate
        ? new Date(initialData.releaseDate)
        : undefined,
      thumbnail: initialData.thumbnailUrl || null,
    },
  });

  const onSubmit = async (values: AlbumInfoValues) => {
    try {
      let thumbnailPayload = {};

      if (values.thumbnail instanceof File) {
        const compressed = await compressImage(values.thumbnail);
        const res = await uploadMedia(compressed, "image", "albums", {
          main: values.title,
          ctx: "",
        });
        thumbnailPayload = {
          thumbnailId: res.publicId,
          thumbnailColor: res.dominantColor,
        };
      } else if (values.thumbnail === null && initialData.thumbnailUrl) {
        thumbnailPayload = { thumbnailId: null, thumbnailColor: null };
      }

      await updateAlbum({
        albumId: initialData.id,
        values: {
          ...values,
          releaseDate: values.releaseDate?.toISOString(),
          ...thumbnailPayload,
        },
      });

      toast.success("Album info updated!");
    } catch (error) {
      toast.error("Failed to update album info");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 border p-6 rounded-lg bg-card"
      >
        <h3 className="text-lg font-medium">Album Metadata</h3>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Album thumbnail</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={value}
                      onChange={onChange}
                      className="aspect-square w-full"
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-2 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Album Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Midnight Memories" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Artist</FormLabel>
                  <FormControl>
                    <ArtistSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Album Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AlbumTypeEnum.options.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Release Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genreIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Album Genres (Main Vibe)</FormLabel>
                    <FormControl>
                      <GenreMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isUpdating}
          >
            {form.formState.isSubmitting || isUpdating
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
