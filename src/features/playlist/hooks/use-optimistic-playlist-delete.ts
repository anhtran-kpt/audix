import { playlistKeys } from "@/features/playlist/api/playlist-keys";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
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
      await qc.cancelQueries({ queryKey: playlistKeys.detail(playlistId) });
      await qc.cancelQueries({ queryKey: playlistKeys.list() });

      const prevLists = qc.getQueryData<PlaylistItem[]>(playlistKeys.list());

      qc.setQueryData<PlaylistItem[]>(playlistKeys.list(), (old = []) =>
        old.filter((pl) => pl.id !== playlistId)
      );

      qc.removeQueries({ queryKey: playlistKeys.detail(playlistId) });

      return { prevLists, playlistId };
    },

    onError: (_, __, ctx) => {
      if (ctx?.prevLists) {
        qc.setQueryData(playlistKeys.list(), ctx.prevLists);
      }
    },

    onSuccess: async (_, { playlistId }) => {
      qc.invalidateQueries({ queryKey: playlistKeys.list() });

      toast.success("Playlist deleted.");
      if (pathname === `/playlists/${playlistId}`) {
        router.push("/");
      }

      qc.removeQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });
}
