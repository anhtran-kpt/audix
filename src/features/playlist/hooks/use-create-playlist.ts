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
import { MyPlaylists } from "@/lib/data/me-data";

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
        qc.cancelQueries({ queryKey: meKeys.banner() }),
      ]);

      const previousPlaylists = qc.getQueryData<MyPlaylists>(
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

      qc.setQueryData<MyPlaylists>(meKeys.myPlaylists(), (old) => {
        if (!old)
          return {
            items: [optimistic],
            pagination: {
              limit: 5,
              offset: 0,
              total: 1,
              hasMore: false,
            },
          };

        return {
          ...old,
          items: [optimistic, ...old.items],
          pagination: {
            ...old.pagination,
            total: old.pagination.total + 1,
          },
        };
      });

      return { previousPlaylists };
    },
    onError: (err, _, ctx) => {
      if (ctx?.previousPlaylists) {
        qc.setQueryData(meKeys.myPlaylists(), ctx.previousPlaylists);
      }
      toast.error(err.message);
    },
    onSuccess: (res) => {
      form.reset();
      onSuccess?.(res);
      router.push(`/playlists/${res.id}`);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.banner() });
      qc.invalidateQueries({ queryKey: meKeys.myPlaylists() });
    },
  });

  return { form, mutation };
}
