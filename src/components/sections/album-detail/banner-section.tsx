"use client";

import { BadgeCheckIcon } from "lucide-react";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { TFullAlbum } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CoverImage } from "@/components/ui/cover-image";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { ArtistImage } from "@/components/ui/artist-image";
import { NavLink } from "@/components/ui/nav-link";
import Dot from "@/components/ui/dot";
import { formatDate } from "date-fns/format";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";

type BannerSectionProps = Pick<
  TFullAlbum,
  | "releaseDate"
  | "imageId"
  | "albumType"
  | "artist"
  | "title"
  | "totalTracks"
  | "duration"
>;

export const BannerSection = ({
  imageId,
  releaseDate,
  albumType,
  artist,
  title,
  totalTracks,
  duration,
}: BannerSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  return (
    <section className="text-white">
      <div className="relative h-96 -mx-12 -mt-15">
        <div
          className="absolute inset-0 -mx-12 -mt-15 bg-gradient-to-t from-[var(--tw-gradient-from)] via-[var(--tw-gradient-via)] to-[var(--tw-gradient-to)]"
          style={
            {
              "--tw-gradient-from": gradient?.from,
              "--tw-gradient-via": gradient?.via,
              "--tw-gradient-to": gradient?.to,
            } as React.CSSProperties
          }
        />
        <div className="absolute left-12 bottom-6 flex items-end gap-6">
          <CoverImage
            alt={title}
            src={imageId}
            size="xl"
            onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
            priority
          />
          <div className="flex flex-col gap-3">
            <p className="font-medium">{albumTypeMap[albumType]}</p>
            <p className="font-bold text-6xl mt-1 mb-3">{title}</p>
            <div className="inline-flex items-center gap-2">
              <ArtistImage alt={artist.name} src={artist.imageId} size="xs" />
              <NavLink href={`/artists/${artist.id}`} className="text-sm">
                {artist.name}
              </NavLink>
              <Dot />
              <span className="">{formatDate(releaseDate, "PP")}</span>
              <div className="flex items-center gap-2">
                {totalTracks > 0 && (
                  <>
                    <Dot />
                    <span>
                      {`${totalTracks} ${pluralize(
                        "tracks",
                        totalTracks
                      )}, ${prettyMilliseconds(duration * 1000)}`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// export const BannerSectionSkeleton = () => {
//   return (
//     <section>
//       <div className="relative h-96 -mx-12 -mt-21">
//         <Skeleton className="absolute inset-0 -mx-12 -mt-24" />
//         <div className="absolute left-12 bottom-6 flex items-end gap-5">
//           <div className="relative rounded-full overflow-hidden size-48">
//             <Skeleton className="size-full rounded-full" />
//           </div>
//           <div className="flex flex-col gap-4">
//             <Skeleton className="w-48 h-6" />
//             <Skeleton className="w-36 h-15" />
//             <Skeleton className="w-12 h-5" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
