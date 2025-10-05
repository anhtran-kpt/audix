"use client";

import PlaylistGrid from "@/components/shared/playlist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { myPlaylistsOptions } from "@/features/me/api/me-options";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { useQuery } from "@tanstack/react-query";

type PlaylistsSectionProps = {
  initialData: PlaylistItem[];
};

export const PlaylistSection = ({ initialData }: PlaylistsSectionProps) => {
  const { data: playlists } = useQuery({
    ...myPlaylistsOptions(),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <section>
      <SectionHeading title="Liked Playlists" />
      <PlaylistGrid playlists={playlists} />
    </section>
  );
};
