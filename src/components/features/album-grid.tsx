"use client";

import { Album } from "@/app/generated/prisma";
import { GridWrapper } from "../ui/grid-wrapper";
import { AlbumItem } from "./album-item";

interface AlbumGridProps {
  albums: Album[];
}

export const AlbumGrid = ({ albums }: AlbumGridProps) => {
  return (
    <GridWrapper>
      {albums.map((album) => (
        <AlbumItem
          key={album.id}
          id={album.id}
          title={album.title}
          imageId={album.imageId}
          releaseDate={album.releaseDate}
          albumType={album.albumType}
        />
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
