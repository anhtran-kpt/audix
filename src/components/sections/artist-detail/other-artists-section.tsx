"use client";

import { ContextPlayButton } from "@/components/features/context-play-button";
import { GridWrapper } from "@/components/ui/grid-wrapper";
import { NavLink } from "@/components/ui/nav-link";
import SectionHeading from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { TArtistGridItem } from "@/types";
import { CldImage } from "next-cloudinary";

interface OtherArtistsSectionProps {
  artists: TArtistGridItem[];
}

export const OtherArtistsSection = ({ artists }: OtherArtistsSectionProps) => {
  return (
    <section>
      <SectionHeading title="Fans also like" href={`/artists`} hasShowAll />
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
};

// export const ArtistOthersSkeleton = () => {
//   return (
//     <section>
//       <SectionHeading heading="Fans also like" />
//       <GridWrapper>
//         {Array.from({ length: 5 }).map((_, i) => (
//           <div key={i} className="">
//             <div className="relative rounded-full overflow-hidden aspect-square mb-4">
//               <Skeleton className="size-full" />
//             </div>
//             <Skeleton className="h-4 w-32" />
//             <Skeleton className="h-3 w-12 mt-4" />
//           </div>
//         ))}
//       </GridWrapper>
//     </section>
//   );
// };
