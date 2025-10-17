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
import { useEffect } from "react";
import { TrackList } from "../track-list/track-list";

type Props = {
  q: string;
  type: string;
  onDataLoad?: (availableTabs: string[]) => void;
};

export function SearchResults({ q, type, onDataLoad }: Props) {
  const { data, status } = useQuery({
    ...searchOptions(
      q,
      type === "all"
        ? ["tracks", "artists", "albums", "playlists", "profiles"]
        : [type],
      { limit: 5 }
    ),
  });

  useEffect(() => {
    if (status === "success" && onDataLoad) {
      if (type !== "all") return;

      const availableTabs = ["all"];

      if (data.tracks?.items.length > 0) availableTabs.push("tracks");
      if (data.artists?.items.length > 0) availableTabs.push("artists");
      if (data.albums?.items.length > 0) availableTabs.push("albums");
      if (data.playlists?.items.length > 0) availableTabs.push("playlists");
      if (data.profiles?.items.length > 0) availableTabs.push("profiles");

      onDataLoad(availableTabs);
    }
  }, [status, data, onDataLoad, type]);

  if (status === "pending") {
    return (
      <div className="flex justify-center items-center py-20">
        <LoaderCircleIcon className="animate-spin size-12" />
      </div>
    );
  }

  if (status === "error") return <p>Something went wrong</p>;

  console.log(data);

  const hasNoResults =
    !data.topResult &&
    [
      data.albums,
      data.artists,
      data.playlists,
      data.tracks,
      data.profiles,
    ].every((arr) => arr.items.length === 0);

  if (hasNoResults)
    return <p className="text-muted-foreground">No results found.</p>;

  if (type === "all") {
    return (
      <div className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-6">
          {data.topResult && <TopResultSection topResult={data.topResult} />}
          {data.tracks?.items.length > 0 && (
            <TracksSection data={data.tracks} q={q} />
          )}
        </div>
        {data.artists?.items.length > 0 && (
          <ArtistsSection data={data.artists} q={q} />
        )}
        {data.albums?.items.length > 0 && (
          <AlbumsSection data={data.albums} q={q} />
        )}
        {data.playlists?.items.length > 0 && (
          <PlaylistsSection data={data.playlists} q={q} />
        )}
        {data.profiles?.items.length > 0 && (
          <ProfilesSection data={data.profiles} q={q} />
        )}
      </div>
    );
  }

  if (type === "tracks") {
    if (data.tracks?.items.length === 0) {
      return <p className="text-muted-foreground">No tracks found.</p>;
    }
    return (
      <TrackList
        tracks={data.tracks.items}
        contextId={q}
        contextType="SEARCH"
        isLoading={false}
      />
    );
  }

  if (type === "artists") {
    if (data.artists?.items.length === 0) {
      return <p className="text-muted-foreground">No artists found.</p>;
    }
    return <ArtistsSection data={data.artists} />;
  }

  if (type === "albums") {
    if (data.albums?.items.length === 0) {
      return <p className="text-muted-foreground">No albums found.</p>;
    }
    return <AlbumsSection data={data.albums} />;
  }

  if (type === "playlists") {
    if (data.playlists?.items.length === 0) {
      return <p className="text-muted-foreground">No playlists found.</p>;
    }
    return <PlaylistsSection data={data.playlists} />;
  }

  if (type === "profiles") {
    if (data.profiles?.items.length === 0) {
      return <p className="text-muted-foreground">No profiles found.</p>;
    }
    return <ProfilesSection data={data.profiles} />;
  }

  return null;
}
