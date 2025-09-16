"use client";

import { SearchResult } from "@/features/search/contracts/search-dtos";
import { GridWrapper } from "../../ui/grid-wrapper";
import { cn } from "@/lib/utils";
import { NavLink } from "../../ui/nav-link";
import { ContextPlayButton } from "../context-play-button";
import { CldImage } from "next-cloudinary";
import SectionHeading from "../../ui/section-heading";
import SeeAllButton from "./see-all-button";

export default function ArtistsSection({
  artists,
  q,
}: {
  artists: SearchResult["artists"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Artists"
        seeAllBtn={q && <SeeAllButton q={q} targetType="artists" />}
      />
      <GridWrapper>
        {artists.map((artist) => (
          <div key={artist.id} className="space-y-4 group">
            <div className="relative rounded-full aspect-square">
              <CldImage
                alt={artist.name}
                src={artist.imageId}
                fill
                className="object-cover rounded-full group-hover:brightness-75"
                sizes="20vw"
              />
              <ContextPlayButton
                context={{
                  type: "ARTIST",
                  contextId: artist.id,
                }}
                className={cn(
                  "absolute bottom-2 right-2",
                  "opacity-0 translate-y-2 scale-95",
                  "transition-all duration-300",
                  "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                )}
              />
            </div>
            <NavLink
              href={`/artists/${artist.id}`}
              className="text-[calc(15rem/16)]"
            >
              {artist.name}
            </NavLink>
            <p className="text-muted-foreground text-[calc(13rem/16)]">
              Artist
            </p>
          </div>
        ))}
      </GridWrapper>
    </section>
  );
}
