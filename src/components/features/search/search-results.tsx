"use client";

import { useQuery } from "@tanstack/react-query";
import TopResultSection from "@/app/(dashboard)/search/_sections/top-result-section";
import TracksSection from "@/app/(dashboard)/search/_sections/tracks-section";
import ArtistsSection from "@/app/(dashboard)/search/_sections/artists-section";
import AlbumsSection from "@/app/(dashboard)/search/_sections/albums-section";
import PlaylistsSection from "@/app/(dashboard)/search/_sections/playlists-section";
import ProfilesSection from "@/app/(dashboard)/search/_sections/profiles-section";
import { LoaderCircleIcon } from "lucide-react";
import { searchOptions } from "@/features/search/api/search-options";

type Props = {
  q: string;
  type: string;
};

export function SearchResults({ q, type }: Props) {
  const { data, status } = useQuery({
    ...searchOptions(
      q,
      type === "all"
        ? ["tracks", "artists", "albums", "playlists", "profiles"]
        : [type],
      type === "all" ? 5 : 50
    ),
  });

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center py-20">
        <LoaderCircleIcon className="animate-spin size-12" />
      </div>
    );
  }

  if (status === "error") return <p>Something went wrong</p>;

  const hasNoResults =
    !data.topResult &&
    [
      data.albums,
      data.artists,
      data.playlists,
      data.tracks,
      data.profiles,
    ].every((arr) => arr.length === 0);

  if (hasNoResults)
    return <p className="text-muted-foreground">No results found.</p>;

  if (type === "all") {
    return (
      <div className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-6">
          {data.topResult && (
            <TopResultSection topResult={data.topResult} q={q} />
          )}
          {data.tracks?.length > 0 && (
            <TracksSection tracks={data.tracks} q={q} />
          )}
        </div>
        {data.artists?.length > 0 && (
          <ArtistsSection artists={data.artists} q={q} />
        )}
        {data.albums?.length > 0 && (
          <AlbumsSection albums={data.albums} q={q} />
        )}
        {data.playlists?.length > 0 && (
          <PlaylistsSection playlists={data.playlists} q={q} />
        )}
        {data.profiles?.length > 0 && (
          <ProfilesSection profiles={data.profiles} q={q} />
        )}
      </div>
    );
  }

  if (type === "tracks") return <TracksSection tracks={data.tracks} />;
  if (type === "artists") return <ArtistsSection artists={data.artists} />;
  if (type === "albums") return <AlbumsSection albums={data.albums} />;
  if (type === "playlists")
    return <PlaylistsSection playlists={data.playlists} />;
  if (type === "profiles") return <ProfilesSection profiles={data.profiles} />;

  return null;
}
