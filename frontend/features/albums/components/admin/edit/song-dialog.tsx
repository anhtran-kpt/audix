"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { GenreMultiSelect } from "@/features/genres/components/admin/genre-multi-select";
import { SongArtistSelector } from "../song-artist-selector";
import { SongCreditSelector } from "../song-credit-selector";
import { createSong, updateSong } from "@/features/songs/api/client";
import { uploadMedia } from "@/features/media/api/client";
import {
  SongMutationValues,
  songMutationSchema,
} from "@/features/albums/schemas/album-edit.schema";
import { SongEntity } from "@/features/common/types/entity.type";
import { albumKeys } from "@/features/albums/api/keys";
import { ArtistBasicInfo } from "../artist-select";

interface SongDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  defaultArtist: ArtistBasicInfo;
  songToEdit?: SongEntity;
}

export function SongDialog({
  open,
  onOpenChange,
  albumId,
  defaultArtist,
  songToEdit,
}: SongDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!songToEdit;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [mainArtistName, setMainArtistName] = useState(defaultArtist.name);

  const form = useForm<SongMutationValues>({
    resolver: zodResolver(songMutationSchema),
    defaultValues: {
      title: "",
      isExplicit: false,
      genreIds: [],
      artists: [],
      credits: [],
    },
  });

  useEffect(() => {
    if (open) {
      if (songToEdit) {
        form.reset({
          title: songToEdit.title,
          isExplicit: songToEdit.isExplicit,
          genreIds: songToEdit.genres?.map((g) => g.id),
          artists: songToEdit.artists?.map((a) => ({
            artistId: a.artistId,
            type: a.type,
          })),
          credits: songToEdit.credits?.map((c) => ({
            role: c.role,
            value: { id: c.artistId || undefined, name: c.name || "" },
          })),
          audioFile: undefined,
        });
      } else {
        form.reset({
          title: "",
          isExplicit: false,
          genreIds: [],
          artists: [{ artistId: defaultArtist.id, type: "MAIN" }],
          credits: [],
          audioFile: undefined,
        });
      }
    }
  }, [open, songToEdit, defaultArtist.id, form]);

  const onSubmit = async (values: SongMutationValues) => {
    try {
      setIsSubmitting(true);

      const metadataPayload = {
        title: values.title,
        albumId: albumId,
        isExplicit: values.isExplicit,
        genreIds: values.genreIds,
        artists: values.artists,
        credits:
          values.credits?.map((c) => ({
            role: c.role,
            artistId: c.value.id || undefined,
            name: !c.value.id ? c.value.name : undefined,
          })) || [],
      };

      if (isEditMode && songToEdit) {
        await updateSong(songToEdit.id, metadataPayload);
        toast.success("Song updated successfully");
      } else {
        if (!values.audioFile) {
          form.setError("audioFile", { message: "Audio file is required" });
          setIsSubmitting(false);
          return;
        }

        const handleProgress = (p: number) =>
          setUploadProgress(`Uploading: ${p}%`);

        const audioRes = await uploadMedia(
          values.audioFile,
          "video",
          "songs",
          { main: values.title, ctx: mainArtistName },
          handleProgress
        );

        await createSong({
          ...metadataPayload,
          audioId: audioRes.publicId,
          duration: audioRes.duration as number,
        });

        toast.success("Song added successfully");
      }

      queryClient.invalidateQueries({ queryKey: albumKeys.details(albumId) });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save song");
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Track Details" : "Add New Track"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update song information. To change the audio file, please delete and re-add."
              : "Upload a new audio file and set song details."}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Song title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEditMode && (
                <FormField
                  control={form.control}
                  name="audioFile"
                  render={({ field: { value, onChange, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Audio File</FormLabel>
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
              )}

              <FormField
                control={form.control}
                name="isExplicit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm h-[72px]">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Explicit Content</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genreIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genres</FormLabel>
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

            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h4 className="font-medium text-sm">Artists & Credits</h4>
              <SongArtistSelector
                name="artists"
                onArtistSelect={(index, artist) => {
                  if (index === 0) {
                    setMainArtistName(artist.name);
                  }
                }}
              />
              <SongCreditSelector name="credits" />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {uploadProgress ||
                  (isEditMode ? "Save Changes" : "Create Song")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
