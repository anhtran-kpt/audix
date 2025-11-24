import { serverFetch } from "@/lib/fetch-server";
import { ArtistSlugResponse, ArtistDetailResponse } from "../albums.type";

export const getAllStaticArtists = async () => {
  return serverFetch<ArtistSlugResponse[]>(`/artists/all-static`);
};

export const getArtistBySlug = async (slug: string) => {
  return serverFetch<ArtistDetailResponse>(`/artists/${slug}`, {
    next: {
      revalidate: 3600,
      tags: [`artist-${slug}`],
    },
  });
};
