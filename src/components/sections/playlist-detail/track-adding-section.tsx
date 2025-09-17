"use client";

import AddToPlaylistButton from "@/components/features/add-to-playlist-button";
import { RowPlayButton } from "@/components/features/row-play-button";
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
import { RefreshCcwIcon, SearchIcon } from "lucide-react";

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
    queryKey: ["playlists", playlistId, "recommended"],
    queryFn: () =>
      getApi<RecommendedTrackItem[]>(
        `/playlists/${playlistId}/recommended?take=5`
      ),
  });

  return (
    <section>
      <h2 className="font-bold text-2xl select-none capitalize mb-2">
        Recommended
      </h2>
      <p className="text-muted-foreground text-13">
        Based on what&apos;s in this playlist
      </p>

      <div className="flex items-end justify-between gap-4">
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
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCcwIcon className={isFetching ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      <div className="mt-6">
        {recommendedTracks && recommendedTracks.length > 0 ? (
          recommendedTracks.map((track) => (
            <div
              key={track.id}
              className={
                "p-2 items-center group hover:bg-muted rounded-md text-muted-foreground hover:text-foreground grid w-full grid-cols-[1fr_1fr_4rem]"
              }
            >
              <TrackItem
                track={track}
                canHover={false}
                isActive={false}
                playButton={
                  <RowPlayButton
                    trackId={track.id}
                    context={{
                      name: track.title,
                      contextId: track.id,
                      type: "TRACK",
                    }}
                  />
                }
              />

              <div>
                <NavLink
                  href={`/albums/${track.album.id}`}
                  className="text-left"
                >
                  {track.album.title}
                </NavLink>
              </div>

              <AddToPlaylistButton track={track} playlistId={playlistId} />
            </div>
          ))
        ) : (
          <p className="text-center py-2">No tracks found.</p>
        )}
      </div>
    </section>
  );
};
