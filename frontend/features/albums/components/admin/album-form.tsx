"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash, Disc } from "lucide-react";
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
import { uploadAudio, uploadImage } from "@/features/media/api/client";
import { createAlbum } from "../../api/client";

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
      songs: [], // Ban đầu chưa có bài nào
    },
  });

  // Hook quan trọng để quản lý mảng songs
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "songs",
  });

  const onSubmit = async (values: AlbumFormValues) => {
    try {
      setIsSubmitting(true);
      setUploadProgress("Creating album info...");

      // --- BƯỚC 1: TẠO ALBUM ---

      // 1a. Upload thumnail album trước
      let thumnailRes = null;
      if (values.thumnail instanceof File) {
        thumnailRes = await uploadImage(values.thumnail);
      }

      // 1b. Gọi API tạo Album
      const albumPayload = {
        title: values.title,
        artistId: values.artistId,
        thumnailId: thumnailRes?.id || null,
        thumnailColor: thumnailRes?.color || null,
      };

      // Giả sử API trả về object album vừa tạo (có ID)
      const newAlbum = await createAlbum(albumPayload);

      if (!newAlbum?.id) throw new Error("Failed to create album");

      // --- BƯỚC 2: TẠO SONGS (Loop) ---

      const totalSongs = values.songs.length;

      // Mẹo: Dùng for...of để chạy tuần tự (tránh spam server)
      // hoặc Promise.all để chạy song song (nếu server khỏe)
      // Ở đây tôi dùng tuần tự để dễ track progress và an toàn

      for (const [index, song] of values.songs.entries()) {
        setUploadProgress(
          `Uploading song ${index + 1}/${totalSongs}: ${song.title}...`
        );

        // 2a. Upload Audio File
        // Lưu ý: Audio nặng, bước này tốn thời gian nhất
        const audioRes = await uploadAudio(song.audioFile);

        // 2b. Tạo Song gắn với Album ID vừa tạo
        const songPayload = {
          title: song.title,
          albumId: newAlbum.id, // LIÊN KẾT Ở ĐÂY
          artistId: song.artistId || values.artistId, // Nếu không chọn feat thì lấy artist của album
          audioId: audioRes.id,
          duration: audioRes.duration || song.duration,
          genreIds: song.genreIds,
        };

        await createSong(songPayload);
      }

      setUploadProgress("Finished!");
      toast.success("Album created successfully!");
      router.push("/admin/albums");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please check console.");
      // Tùy chọn: Nếu lỗi giữa chừng, có thể gọi API delete album rác vừa tạo
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const onNext = async () => {
    // Validate Step 1 trước khi sang Step 2
    const valid = await form.trigger(["title", "artistId", "thumnail"]);
    if (valid) setStep(2);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background border rounded-lg">
      {/* Progress Indicator */}
      <div className="flex items-center gap-4 mb-8 text-sm font-medium">
        <span className={step === 1 ? "text-primary" : "text-muted-foreground"}>
          1. Album Info
        </span>
        <span className="text-muted-foreground">/</span>
        <span className={step === 2 ? "text-primary" : "text-muted-foreground"}>
          2. Add Songs
        </span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* === STEP 1: ALBUM INFO === */}
          <div className={step === 1 ? "block space-y-6" : "hidden"}>
            <div className="grid grid-cols-3 gap-8">
              {/* thumnail Image Col */}
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="thumnail"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Album thumnail</FormLabel>
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

              {/* Info Col */}
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
                {/* Select Artist ở đây (Bạn tự implement component Select) */}
                {/* ... */}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={onNext}>
                Next: Add Songs
              </Button>
            </div>
          </div>

          {/* === STEP 2: SONGS LIST === */}
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
                    audioFile: undefined as any, // Placeholder
                    artistId: form.getValues("artistId"), // Mặc định lấy artist của album
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

                    <div className="col-span-10 grid grid-cols-2 gap-4">
                      {/* Song Title */}
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

                      {/* Song Artist (Feat) - Optional */}
                      {/* Có thể thêm Select Artist ở đây nếu bài hát feat người khác */}

                      {/* Audio File Input - Custom Component hoặc Input File thô */}
                      <FormField
                        control={form.control}
                        name={`songs.${index}.audioFile`}
                        render={({ field: { value, onChange, ...rest } }) => (
                          <FormItem className="col-span-2">
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
                              {/* Tốt nhất nên viết 1 component AudioUpload đẹp hơn */}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-1 pt-8 text-right">
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
    </div>
  );
}
