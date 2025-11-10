import { getApi } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type OverlayType = "tracks" | "artists" | "albums" | "playlists";

export function useBaseUserOverlay(type: OverlayType) {
  const queryClient = useQueryClient();
  const key = ["me", "overlay", type];

  const { data: map = {} } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await getApi<string[]>(`/me/overlay/${type}`);

      return Object.fromEntries(res.map((id) => [id, true]));
    },
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
