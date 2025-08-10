"use client";

import { CoverImage } from "@/components/ui/cover-image";
import Explicit from "@/components/ui/explicit";
import { IconButton } from "@/components/ui/icon-button";
import { ItemTitle } from "@/components/ui/item-title";
import { NavLink } from "@/components/ui/nav-link";
import SectionHeading from "@/components/ui/section-heading";
import { TTrack } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { EllipsisIcon } from "lucide-react";

type NewReleasesSectionProps = {
  tracks: TTrack[];
};

export const NewReleasesSection = ({ tracks }: NewReleasesSectionProps) => {
  return (
    <section>
      <div className="flex justify-between items-center">
        <SectionHeading heading="New Releases" />
        <NavLink href={`/new-releases`}>Show all</NavLink>
      </div>
      <div className="grid gap-x-4 gap-y-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center justify-between gap-4 group hover:bg-muted py-2 px-3 rounded-sm"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CoverImage
                src={track.album.imageId}
                alt={track.title}
                size="sm"
                track={track}
                className="group-hover:brightness-60"
              />
              <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                <ItemTitle title={track.title} />
                <div className="flex items-center text-sm gap-x-1 text-muted-foreground truncate">
                  {track.isExplicit && <Explicit />}
                  {track.artists.map(({ artist }, index, originalArr) => (
                    <span key={artist.id}>
                      <NavLink href={`/artists/${artist.id}`}>
                        {artist.name}
                      </NavLink>
                      {index < originalArr.length - 1 && ", "}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(track.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <IconButton
              icon={EllipsisIcon}
              className="group-hover:visible invisible shrink-0"
              tooltipContent={
                <>
                  More options for <strong>{track.title}</strong>
                </>
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};
