"use client";

import { TrackList } from "@/components/features/track-list";
import { Button } from "@/components/ui/button";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const PopularTracksSection = ({ artistId }: { artistId: string }) => {
  const INITIAL_LIMIT = 5;
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [expanded, setExpanded] = useState(false);

  const { data, status } = useQuery({
    ...artistQueryOptions.popularTracks(artistId, { limit }),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  const handleToggle = () => {
    if (expanded) {
      setLimit(INITIAL_LIMIT);
      setExpanded(false);
    } else {
      const nextLimit = data.pagination?.hasMore
        ? limit + INITIAL_LIMIT
        : data.items.length;
      setLimit(nextLimit);
      setExpanded(true);
    }
  };

  const canSeeMore = data.pagination?.hasMore || expanded;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-2xl select-none capitalize">Popular</h2>
      </div>

      <TrackList
        contextId={artistId}
        contextType="ARTIST"
        tracks={data.items}
      />

      {canSeeMore && (
        <div className="flex mt-4">
          <Button
            variant="link"
            className="text-sm font-medium text-foreground p-0 h-fit"
            onClick={handleToggle}
          >
            {expanded ? "See less" : "See more"}
          </Button>
        </div>
      )}
    </section>
  );
};
