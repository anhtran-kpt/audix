import { getApi } from "@/lib/http/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type OverlayType = "tracks" | "artists" | "albums" | "playlists";

export function useBaseUserOverlay(type: OverlayType) {
  const queryClient = useQueryClient();
  const key = ["me", "overlay", type];

  const { data: map = {} } = useQuery({
    queryKey: key,
    queryFn: async () =>
      await getApi<Record<string, boolean>>(`/me/overlay/${type}`),
    staleTime: Infinity,
  });

  const optimisticToggle = (id: string) => {
    queryClient.setQueryData<Record<string, boolean>>(key, (old = {}) => ({
      ...old,
      [id]: !old[id],
    }));
  };

  const revert = (prev: Record<string, boolean>) => {
    queryClient.setQueryData(key, prev);
  };

  const getPrev = () =>
    queryClient.getQueryData<Record<string, boolean>>(key) ?? {};

  return {
    map,
    key,
    optimisticToggle,
    revert,
    getPrev,
  };
}
