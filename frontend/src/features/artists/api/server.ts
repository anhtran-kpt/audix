import { serverFetch } from "@/lib/fetch-server";
import { ArtistSlug, FullArtist } from "../artists.type";

export const getAllStaticArtists = async () => {
  return serverFetch<ArtistSlug[]>(`/artists/all-static`);
};

export const getArtistBySlug = async (slug: string) => {
  return serverFetch<FullArtist>(`/artists/${slug}`, {
    next: {
      revalidate: 60,
      tags: [`artist-${slug}`],
    },
  });
};
