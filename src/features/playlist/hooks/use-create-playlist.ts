"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApi } from "@/lib/http/api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  CreatePlaylistInput,
  CreatePlaylistOutput,
  PlaylistItem,
} from "@/features/playlist/contracts/playlist-dto";
import { CreatePlaylistInputSchema } from "@/features/playlist/contracts/playlist-schema";
import { meKeys } from "@/features/me/api/me-keys";
import { useRouter } from "next/navigation";

export function useCreatePlaylist(
  onSuccess?: (res: CreatePlaylistOutput) => void
) {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const router = useRouter();

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
      postApi<CreatePlaylistOutput>("/playlists", { body: data }),
    onMutate: async (vars) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: meKeys.myPlaylists() }),
        qc.cancelQueries({ queryKey: meKeys.profile() }),
      ]);

      const previousPlaylists = qc.getQueryData<PlaylistItem[]>(
        meKeys.myPlaylists()
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

      qc.setQueryData<PlaylistItem[]>(meKeys.myPlaylists(), (old) =>
        old ? [optimistic, ...old] : [optimistic]
      );

      return { previousPlaylists };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previousPlaylists) {
        qc.setQueryData(meKeys.myPlaylists(), ctx.previousPlaylists);
      }
      toast.error(err.message);
    },
    onSuccess: (res) => {
      qc.setQueryData<PlaylistItem[]>(meKeys.myPlaylists(), (old) => {
        if (!old) return [res];
        const filtered = old.filter((pl) => !pl.id.startsWith("optimistic-"));
        return [res, ...filtered];
      });

      form.reset();
      onSuccess?.(res);
      router.push(`/playlists/${res.id}`);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.profile() });
    },
  });

  return { form, mutation };
}
