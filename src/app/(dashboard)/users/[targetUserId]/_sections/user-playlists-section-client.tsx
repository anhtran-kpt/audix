"use client";

import { PlaylistItem } from "@/components/features/entity-item/playlist-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { UserPlaylists } from "@/lib/data/user-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

type UserPlaylistsSectionClientProps = {
  initialData: UserPlaylists;
  targetUserId: string;
};
export const UserPlaylistsSectionClient = ({
  initialData,
  targetUserId,
}: UserPlaylistsSectionClientProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...userQueryOptions.playlists(targetUserId, { limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section
      title="Public Playlists"
      showAllHref={
        data.pagination.hasMore ? `/users/${targetUserId}/playlists` : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(playlist) => <PlaylistItem playlist={playlist} />}
      />
    </Section>
  );
};
