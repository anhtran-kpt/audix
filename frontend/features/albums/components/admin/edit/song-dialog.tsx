"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  SongMutationValues,
  songMutationSchema,
} from "@/features/albums/schemas/album-edit.schema";
import { createSong } from "@/features/songs/api/client";
import { uploadMedia } from "@/features/media/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { SongEntity } from "@/features/common/types/entity.type";
import { albumKeys } from "@/features/albums/api/keys";
import { toast } from "sonner";

interface SongDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  songToEdit?: SongEntity; // Nếu có -> Edit mode, Không có -> Create mode
  defaultArtistId: string; // Lấy từ Album để pre-fill
}

export function SongDialog({
  open,
  onOpenChange,
  albumId,
  songToEdit,
  defaultArtistId,
}: SongDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!songToEdit;
  const [uploadProgress, setUploadProgress] = useState("");

  const form = useForm<SongMutationValues>({
    resolver: zodResolver(songMutationSchema),
    defaultValues: {
      title: "",
      genreIds: [],
      isExplicit: false,
      artists: [{ artistId: defaultArtistId, type: "MAIN" }],
      credits: [],
      audioFile: undefined,
    },
  });

  // Reset form khi mở modal hoặc đổi song
  useEffect(() => {
    if (songToEdit) {
      form.reset({
        title: songToEdit.title,
        genreIds: songToEdit.genres?.map((g) => g.id),
        isExplicit: songToEdit.isExplicit,
        artists: songToEdit.artists?.map((a) => ({
          artistId: a.artistId,
          type: a.type,
        })),
        credits: songToEdit.credits?.map((c) => ({
          role: c.role,
          value: { id: c.artistId || undefined, name: c.name || "" },
        })),
      });
    } else {
      form.reset({
        title: "",
        artists: [{ artistId: defaultArtistId, type: "MAIN" }],
        genreIds: [],
        credits: [],
      });
    }
  }, [songToEdit, open, form, defaultArtistId]);

  const onSubmit = async (values: SongMutationValues) => {
    try {
      setUploadProgress("Processing...");

      const basePayload = {
        title: values.title,
        albumId: albumId,
        genreIds: values.genreIds,
        isExplicit: values.isExplicit,
        artists: values.artists,
        credits: values.credits?.map((c) => ({
          role: c.role,
          artistId: c.value.id || undefined,
          name: !c.value.id ? c.value.name : undefined,
        })),
      };

      if (isEditMode) {
        // --- EDIT MODE ---
        // (Tạm thời chỉ update metadata, không update audio file để đơn giản)
        await updateSong(songToEdit.id, basePayload);
      } else {
        if (!values.audioFile) {
          form.setError("audioFile", { message: "Audio file is required" });
          return;
        }

        const handleProgress = (p: number) =>
          setUploadProgress(`Uploading: ${p}%`);

        // Upload Audio
        const audioRes = await uploadMedia(
          values.audioFile,
          "video",
          "songs",
          { main: values.title, ctx: "unknown" }, // Bạn có thể pass artistName vào props để đặt tên file đẹp hơn
          handleProgress
        );

        await createSong({
          ...basePayload,
          audioId: audioRes.publicId,
          duration: audioRes.duration,
        });
      }

      queryClient.invalidateQueries({ queryKey: albumKeys.details(albumId) });

      onOpenChange(false);
      toast.success(isEditMode ? "Song updated" : "Song added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save song");
    } finally {
      setUploadProgress("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Track" : "Add New Track"}
          </DialogTitle>
        </DialogHeader>

        {/* Wrap FormProvider để các sub-components (SongArtistSelector) dùng được */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Các trường UI: Title, Audio (ẩn nếu edit), Genres... */}
            {/* Tái sử dụng các component input bạn đã có */}

            <Button type="submit" disabled={!!uploadProgress}>
              {uploadProgress || "Save Track"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
