"use client";

import TrackAddingButton from "@/components/features/track-adding-button";
import TrackItem from "@/components/features/track-item";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavLink } from "@/components/ui/nav-link";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { RecommendedTrackItem } from "@/features/track/contracts/track-dto";
import { getApi } from "@/lib/http/request";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";

type TrackAddingSectionProps = {
  playlistId: zCuidType;
};

export const TrackAddingSection = ({ playlistId }: TrackAddingSectionProps) => {
  const {
    data: recommendedTracks,
    refetch,
    isFetching,
  } = useQuery({
    enabled: !!playlistId,
    queryKey: ["playlists", playlistId, "recommendations"],
    queryFn: () =>
      getApi<RecommendedTrackItem[]>(
        `/playlists/${playlistId}/recommendations`
      ),
  });

  console.log(recommendedTracks);

  return (
    <section>
      <h2 className="font-bold text-2xl select-none capitalize mb-2">
        Recommended
      </h2>
      <p className="text-muted-foreground text-[calc(13rem/16)]">
        Based on what&apos;s in this playlist
      </p>

      <div className="grid w-full max-w-sm items-center gap-3 relative mt-6">
        <Label
          htmlFor="header-search-bar"
          className="absolute top-1/2 -translate-y-1/2 left-3"
        >
          <IconButton icon={SearchIcon} />
        </Label>
        <Input
          type="search"
          id="header-search-bar"
          placeholder="Search for songs..."
          className="pl-10"
        />
      </div>

      <div className="mt-6">
        {recommendedTracks && recommendedTracks.length > 0 ? (
          recommendedTracks.map((track, trackIndex) => (
            <div
              key={track.id}
              className={
                "p-2 items-center group hover:bg-muted rounded-md text-muted-foreground hover:text-foreground grid w-full grid-cols-[1fr_1fr_4rem]"
              }
            >
              <TrackItem track={track} canHover={false} isActive={false} />

              <div>
                <NavLink
                  href={`/albums/${track.album.id}`}
                  className="text-left"
                >
                  {track.album.title}
                </NavLink>
              </div>

              <TrackAddingButton
                trackId={track.id}
                playlistId={playlistId}
                position={trackIndex}
              />
            </div>
          ))
        ) : (
          <p className="text-center py-2">No tracks found.</p>
        )}
      </div>
      <div className="flex justify-items-end">
        <Button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button>
      </div>
    </section>
  );
};
