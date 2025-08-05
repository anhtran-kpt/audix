"use client";

import { Album } from "@/app/generated/prisma";
import { CldImage } from "next-cloudinary";
import { formatDate } from "date-fns";
import { NavLink } from "../ui/nav-link";
import { Skeleton } from "../ui/skeleton";
import { GridWrapper } from "../ui/grid-wrapper";
import PlayButton from "../ui/play-button";
import { cn } from "@/lib/utils";
import { DotIcon } from "lucide-react";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import Dot from "../ui/dot";

interface AlbumGridProps {
  albums: Album[];
}

export const AlbumGrid = ({ albums }: AlbumGridProps) => {
  return (
    <GridWrapper>
      {albums.map((album) => (
        <div
          key={album.slug}
          className="flex flex-col group gap-2 overflow-hidden"
        >
          <div className="relative rounded-md overflow-hidden size-full aspect-square">
            <CldImage
              src={album.imageId}
              alt={album.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300 group-hover:brightness-75"
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
          <div className="flex flex-col items-start w-full min-w-0">
            <NavLink
              href=""
              // href={`/artists/${album.artist.slug}/albums/${album.slug}`}
              className="text-[calc(15rem/16)] truncate w-full"
            >
              {album.title}
            </NavLink>
            <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
              <span>{formatDate(album.releaseDate, "yyyy")}</span>
              <Dot />
              <span>{albumTypeMap[album.albumType]}</span>
            </div>
          </div>
        </div>
      ))}
    </GridWrapper>
  );
};

// export const AlbumGridSkeleton = ({ count = 5 }: { count: number }) => {
//   return (
//     <GridWrapper>
//       {Array.from({ length: count }).map((_, i) => (
//         <div key={i} className="flex flex-col group gap-2 overflow-hidden">
//           <div className="relative rounded-md overflow-hidden size-full aspect-square">
//             <Skeleton className="size-full" />
//           </div>
//           <div className="flex flex-col gap-2 items-start w-full min-w-0">
//             <Skeleton className="w-2/3 h-5" />
//             <Skeleton className="w-16 h-3" />
//           </div>
//         </div>
//       ))}
//     </GridWrapper>
//   );
// };
