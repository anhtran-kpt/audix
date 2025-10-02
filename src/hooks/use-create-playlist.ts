"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/lib/http/request";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  CreatePlaylistInput,
  CreatePlaylistOutput,
  PlaylistItem,
} from "@/features/playlist/contracts/playlist-dto";
import { CreatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-schema";
import { playlistKeys } from "@/features/playlist/api/playlist-keys";

export function useCreatePlaylist(
  onSuccess?: (res: CreatePlaylistOutput) => void
) {
  const { data: session } = useSession();
  const qc = useQueryClient();

  const form = useForm<CreatePlaylistInput>({
    resolver: zodResolver(CreatePlaylistInputSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      isPublic: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreatePlaylistInput) =>
      postApi<CreatePlaylistOutput>("/playlists", data),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: playlistKeys.list() });

      const previousPlaylists = qc.getQueryData<PlaylistItem[]>(
        playlistKeys.list()
      );

      const optimistic: PlaylistItem = {
        id: `optimistic-${Date.now()}`,
        title: vars.title,
        imageId: null,
        user: {
          name: session?.user.name ?? "",
          id: `optimistic-${Date.now()}`,
        },
      };

      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (old) =>
        old ? [optimistic, ...old] : [optimistic]
      );

      return { previousPlaylists };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previousPlaylists) {
        qc.setQueryData(playlistKeys.list(), ctx.previousPlaylists);
      }
      toast.error(err.message);
    },
    onSuccess: (res) => {
      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (old) => {
        if (!old) return [res];
        const filtered = old.filter((pl) => !pl.id.startsWith("optimistic-"));
        return [res, ...filtered];
      });

      onSuccess?.(res);
      form.reset();
    },
  });

  return { form, mutation };
}
