"use client";

import { ContextPlayButton } from "@/components/features/context-play-button";
import { GridWrapper } from "@/components/ui/grid-wrapper";
import { NavLink } from "@/components/ui/nav-link";
import SectionHeading from "@/components/ui/section-heading";
import { ArtistBase } from "@/features/artist/contracts/artist-dto";
import { cn } from "@/lib/utils";
import { CldImage } from "next-cloudinary";

type OtherArtistsSectionProps = {
  suggestions: Pick<ArtistBase, "id" | "imageId" | "name">[];
};

export const OtherArtistsSection = ({
  suggestions,
}: OtherArtistsSectionProps) => {
  return (
    <section>
      <SectionHeading title="Fans also like" href={`/artists`} hasShowAll />
      <GridWrapper>
        {suggestions.map((artist) => (
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
            <NavLink href={`/artists/${artist.id}`} className="text-15">
              {artist.name}
            </NavLink>
            <p className="text-muted-foreground text-13">Artist</p>
          </div>
        ))}
      </GridWrapper>
    </section>
  );
};
