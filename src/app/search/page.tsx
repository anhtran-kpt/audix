"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { searchOptions } from "@/features/search/query/search-options";
import { useSearchParams } from "next/navigation";
import TopResultSection from "@/components/features/top-result-section";
import TrackSection from "@/components/features/tracks-section";
import ArtistsSection from "@/components/features/artists-section";
import AlbumsSection from "@/components/features/albums-section";
import PlaylistsSection from "@/components/features/playlists-section";
import { LoaderCircleIcon } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const { data, status } = useQuery({ ...searchOptions(q) });

  if (!q) return <div>Type something to search</div>;
  if (status === "error") return <div>Something went wrong</div>;

  if (status === "pending") {
    return (
      <>
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <LoaderCircleIcon className="animate-spin size-12" />
        </div>
      </>
    );
  }

  const hasNoResults =
    !data.topResult &&
    [data.albums, data.artists, data.playlists, data.tracks, data.users].every(
      (arr) => arr.length === 0
    );

  return (
    <>
      {q &&
        (!hasNoResults ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-5">
              {data.topResult && (
                <TopResultSection topResult={data.topResult} />
              )}
              {data.tracks && data.tracks.length > 0 && (
                <TrackSection tracks={data.tracks} />
              )}
            </div>

            {data.artists && data.artists.length > 0 && (
              <ArtistsSection artists={data.artists} />
            )}

            {data.albums && data.albums.length > 0 && (
              <AlbumsSection albums={data.albums} />
            )}

            {data.playlists && data.playlists.length > 0 && (
              <PlaylistsSection playlists={data.playlists} />
            )}
          </div>
        ) : (
          <p className="text-muted-foreground">No results found.</p>
        ))}
    </>
  );
}
