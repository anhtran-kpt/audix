import { meKeys } from "@/features/me/api/me-keys";
import { playlistKeys } from "@/features/playlist/api/playlist-keys";
import { MyPlaylists } from "@/lib/data/me-data";
import { deleteApi } from "@/lib/http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

type DeletePlaylistInput = {
  playlistId: string;
};

export function useOptimisticPlaylistDelete() {
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  return useMutation({
    mutationFn: ({ playlistId }: DeletePlaylistInput) =>
      deleteApi(`/playlists/${playlistId}`),

    onMutate: async ({ playlistId }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: playlistKeys.banner(playlistId) }),
        qc.cancelQueries({ queryKey: playlistKeys.tracks(playlistId) }),
        qc.cancelQueries({ queryKey: meKeys.myPlaylists() }),
      ]);

      const prevData = qc.getQueryData(meKeys.myPlaylists());

      qc.setQueryData<MyPlaylists>(meKeys.myPlaylists(), (old) => {
        if (!old) return;

        return {
          ...old,
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
          items: old?.items.filter((pl) => pl.id !== playlistId),
        };
      });

      return { prevData, playlistId };
    },

    onError: (_, __, ctx) => {
      if (!ctx) return;

      qc.setQueryData(meKeys.myPlaylists(), ctx.prevData);
    },

    onSuccess: async (_, { playlistId }) => {
      toast.success("Playlist deleted.");
      if (pathname === `/playlists/${playlistId}`) {
        router.push("/");
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: meKeys.myPlaylists() });
    },
  });
}
