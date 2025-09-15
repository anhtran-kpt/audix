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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const { data, status } = useQuery({ ...searchOptions(q) });

  if (!q) return <div>Type something to search</div>;
  if (status === "error") return <div>Something went wrong</div>;

  console.log(data);

  return (
    <>
      {status === "pending" && (
        <div className="grid gap-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-64" />
        </div>
      )}

      {q && !data && <p className="text-muted-foreground">No results found.</p>}

      {data && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            {data.topResult && <TopResultSection />}
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

          {/* {data.artists && data.artists.length > 0 && (
            <section>
              <h2 className="font-semibold text-lg mb-2">Artists</h2>
              <ul className="space-y-1">
                {data.artists.map((artist) => (
                  <li key={artist.id}>
                    <Link
                      href={`/artist/${artist.id}`}
                      className="hover:underline"
                    >
                      {artist.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.albums && data.albums.length > 0 && (
            <section>
              <h2 className="font-semibold text-lg mb-2">Albums</h2>
              <ul className="space-y-1">
                {data.albums.map((album) => (
                  <li key={album.id}>
                    <Link
                      href={`/album/${album.id}`}
                      className="hover:underline"
                    >
                      {album.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.playlists && data.playlists.length > 0 && (
            <section>
              <h2 className="font-semibold text-lg mb-2">Playlists</h2>
              <ul className="space-y-1">
                {data.playlists.map((pl) => (
                  <li key={pl.id}>
                    <Link
                      href={`/playlist/${pl.id}`}
                      className="hover:underline"
                    >
                      {pl.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )} */}
        </div>
      )}
    </>
  );
}
