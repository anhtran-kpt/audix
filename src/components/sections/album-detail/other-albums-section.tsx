"use client";

import { GridWrapper } from "@/components/ui/grid-wrapper";
import { NavLink } from "@/components/ui/nav-link";
import PlayButton from "@/components/ui/play-button";
import SectionHeading from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { TAlbumGridItem, TArtist } from "@/types";
import { formatDate } from "date-fns";
import { CldImage } from "next-cloudinary";

interface OtherAlbumsSectionProps {
  artist: Partial<TArtist>;
  albums: TAlbumGridItem[];
}

export const OtherAlbumsSection = ({
  artist,
  albums,
}: OtherAlbumsSectionProps) => {
  return (
    <section>
      <div className="flex justify-between items-center">
        <SectionHeading heading={`More by ${artist.name}`} />
        <NavLink href={`/artists/${artist.id}/albums`}>Show all</NavLink>
      </div>
      <GridWrapper>
        {albums.map((album) => (
          <div key={album.id} className="space-y-4 group">
            <div className="relative rounded-md aspect-square">
              <CldImage
                alt={album.title}
                src={album.imageId}
                fill
                className="object-cover rounded-md group-hover:brightness-75"
                sizes="20vw"
              />
              <PlayButton
                className={cn(
                  "absolute bottom-2 right-2",
                  "opacity-0 translate-y-2 scale-95",
                  "transition-all duration-300",
                  "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                )}
              />
            </div>
            <NavLink
              href={`/albums/${album.id}`}
              className="text-[calc(15rem/16)]"
            >
              {album.title}
            </NavLink>
            <p className="text-muted-foreground text-[calc(13rem/16)]">
              {formatDate(album.releaseDate, "yyyy")}
            </p>
          </div>
        ))}
      </GridWrapper>
    </section>
  );
};

// export const AlbumOthersSkeleton = () => {
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
