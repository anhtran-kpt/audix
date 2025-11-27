"use client";

import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash, Disc, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-load";
import {
  albumFormSchema,
  AlbumFormValues,
} from "../../schemas/album-form.schema";
import {
  getUploadAudioSignature,
  uploadAudio,
  uploadImage,
} from "@/features/media/api/client";
import { createAlbum } from "../../api/client";
import { createSong } from "@/features/songs/api/client";
import { SongCreditSelector } from "./song-credit-selector";
import { SongArtistSelector } from "./song-artist-selector";
import { ArtistSelect } from "./artist-select";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CreateSongDto } from "@/features/songs/songs.type";
import { Calendar } from "@/components/ui/calendar";

export function AlbumForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumFormSchema),
    defaultValues: {
      title: "",
      artistId: "",
      songs: [],
      type: "SINGLE",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "songs",
  });

  const onSubmit = async (values: AlbumFormValues) => {
    try {
      setIsSubmitting(true);
      setUploadProgress("Preparing album...");

      let thumbnailRes = null;
      if (values.thumbnail instanceof File) {
        thumbnailRes = await uploadImage(values.thumbnail);
      }

      const newAlbum = await createAlbum({
        title: values.title,
        artistId: values.artistId,
        thumbnailId: thumbnailRes?.publicId || null,
        thumbnailColor: thumbnailRes?.dominantColor || null,
        type: values.type,
        releaseDate: values.releaseDate
          ? values.releaseDate.toISOString()
          : undefined,
      });

      if (!newAlbum?.id) throw new Error("Failed to create album");

      setUploadProgress("Fetching secure signature...");
      const signData = await getUploadAudioSignature();
      const totalSongs = values.songs.length;

      for (const [index, song] of values.songs.entries()) {
        const songIndex = index + 1;

        const handleProgress = (percent: number) => {
          setUploadProgress(
            `Uploading song ${songIndex}/${totalSongs}: ${percent}%`
          );
        };

        const audioRes = await uploadAudio(
          song.audioFile,
          signData,
          handleProgress
        );
        setUploadProgress(`Saving song ${songIndex}/${totalSongs}...`);

        const songPayload: CreateSongDto = {
          title: song.title,
          albumId: newAlbum.id,
          audioId: audioRes.id,
          duration: audioRes.duration || song.duration || 0,
          order: songIndex,
          isExplicit: song.isExplicit,
          artists: song.artists.map((a) => ({
            artistId: a.artistId,
            type: a.type,
          })),
          credits:
            song.credits?.map((c) => ({
              role: c.role,
              artistId: c.value.id || undefined,
              name: !c.value.id ? c.value.name : undefined,
            })) || [],
          genres: song.genres || [],
        };

        await createSong(songPayload);
      }

      setUploadProgress("All done!");
      toast.success("Album created successfully!");
      router.push("/admin/albums");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const onNext = async () => {
    const valid = await form.trigger(["title", "artistId", "thumbnail"]);
    if (valid) setStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background border rounded-lg">
      <div className="flex items-center gap-4 mb-8 text-sm font-medium">
        <span className={step === 1 ? "text-primary" : "text-muted-foreground"}>
          1. Album Info
        </span>
        <span className="text-muted-foreground">/</span>
        <span className={step === 2 ? "text-primary" : "text-muted-foreground"}>
          2. Add Songs
        </span>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className={step === 1 ? "block space-y-6" : "hidden"}>
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
                          <Input
                            placeholder="e.g. Midnight Memories"
                            {...field}
                          />
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
                    {/* 1. Album Type Select */}
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
                              <SelectItem value="SINGLE">Single</SelectItem>
                              <SelectItem value="EP">EP</SelectItem>
                              <SelectItem value="ALBUM">Album</SelectItem>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                autoFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={onNext}>
                  Next: Add Songs
                </Button>
              </div>
            </div>

            <div className={step === 2 ? "block space-y-6" : "hidden"}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Tracklist</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      title: "",
                      audioFile: undefined as any,
                      artists: [
                        {
                          artistId: form.getValues("artistId"),
                          type: "MAIN",
                        },
                      ],
                      credits: [],
                      genres: [],
                      isExplicit: false,
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Track
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="p-4 grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-1 flex items-center justify-center pt-3 text-muted-foreground font-mono">
                        {index + 1}
                      </div>

                      <div className="col-span-10 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`songs.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Title</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Song Name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`songs.${index}.audioFile`}
                            render={({
                              field: { value, onChange, ...rest },
                            }) => (
                              <FormItem>
                                <FormLabel className="text-xs">
                                  Audio File
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) onChange(file);
                                    }}
                                    {...rest}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="bg-muted/30 p-3 rounded-md space-y-4">
                          <SongArtistSelector songIndex={index} />
                          <SongCreditSelector songIndex={index} />
                        </div>
                      </div>

                      <div className="col-span-1 pt-2 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed rounded-lg text-muted-foreground">
                    <Disc className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No songs added yet.</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? uploadProgress : "Create Album"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
