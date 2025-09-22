"use client";

import { GridWrapper } from "../ui/grid-wrapper";
import LargeMediaCover from "./large-media-cover";
import { NavLink } from "../ui/nav-link";
import { ArtistBase } from "@/features/artist/contracts/artist-dto";

type ArtistGridProps = {
  artists: Pick<ArtistBase, "name" | "imageId" | "id">[];
};

export default function ArtistGrid({ artists }: ArtistGridProps) {
  return (
    <GridWrapper>
      {artists.map((artist) => (
        <div
          key={artist.id}
          className="flex flex-col group/large-cover gap-2 overflow-hidden"
        >
          <LargeMediaCover
            alt={artist.name}
            src={artist.imageId}
            context={{
              contextType: "ARTIST",
              contextIdOrQuery: artist.id,
            }}
          />
          <div className="flex flex-col items-start w-full min-w-0">
            <NavLink
              href={`/artists/${artist.id}`}
              className="text-15 truncate"
            >
              {artist.name}
            </NavLink>
            <div className="flex text-13 text-muted-foreground items-center gap-1.5 mt-0.5">
              <span>Artist</span>
            </div>
          </div>
        </div>
      ))}
    </GridWrapper>
  );
}
