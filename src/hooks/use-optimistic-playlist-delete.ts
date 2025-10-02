import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { deleteApi } from "@/lib/http/request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SidebarPlaylist } from "@/features/playlist/contracts/playlist-dto";
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
      await qc.cancelQueries({ queryKey: playlistKeys.sidebarPlaylists() });
      await qc.cancelQueries({ queryKey: playlistKeys.list() });

      const prevLists = qc.getQueryData<SidebarPlaylist[]>(
        playlistKeys.sidebarPlaylists()
      );

      qc.setQueryData<SidebarPlaylist[]>(
        playlistKeys.sidebarPlaylists(),
        (old = []) => old.filter((pl) => pl.id !== playlistId)
      );

      qc.setQueryData<SidebarPlaylist[]>(playlistKeys.list(), (old = []) =>
        old.filter((pl) => pl.id !== playlistId)
      );

      qc.removeQueries({ queryKey: playlistKeys.detail(playlistId) });

      return { prevLists, playlistId };
    },

    onError: (_, __, ctx) => {
      if (ctx?.prevLists) {
        qc.setQueryData(playlistKeys.sidebarPlaylists(), ctx.prevLists);
        qc.setQueryData(playlistKeys.list(), ctx.prevLists);
      }
    },

    onSuccess: async (_, { playlistId }) => {
      qc.invalidateQueries({ queryKey: playlistKeys.sidebarPlaylists() });
      qc.invalidateQueries({ queryKey: playlistKeys.list() });

      toast.success("Playlist deleted.");
      if (pathname === `/playlists/${playlistId}`) {
        router.push("/");
      }

      qc.removeQueries({ queryKey: playlistKeys.detail(playlistId) });
    },
  });
}
