import { getApi } from "@/lib/http/request";
import { queryOptions } from "@tanstack/react-query";
import { FollowStatus, SidebarArtist } from "../contracts/artist-dto";
import { artistKeys } from "./artist-keys";
import { zCuidSchemaType } from "@/features/shared/contracts/shared-dto";

export const sidebarArtistOptions = () => {
  return queryOptions({
    queryKey: artistKeys.sidebarArtists(),
    queryFn: () => getApi<SidebarArtist[]>("/me/sidebar/artists"),
  });
};

export const followStatusOptions = (artistId: zCuidSchemaType) => {
  return queryOptions({
    queryKey: artistKeys.followStatus(artistId),
    queryFn: () => getApi<FollowStatus>(`/artists/${artistId}/follow`),
    staleTime: 30_000,
  });
};
