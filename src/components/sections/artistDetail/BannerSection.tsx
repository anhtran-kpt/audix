"use client";

import { BadgeCheckIcon } from "lucide-react";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { TArtist } from "@/types";
import { ArtistImage } from "@/components/ui/artist-image";

type BannerSectionProps = Pick<
  TArtist,
  "imageId" | "isVerified" | "monthlyListeners" | "name"
>;

export const BannerSection = ({
  imageId,
  isVerified,
  monthlyListeners,
  name,
}: BannerSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  return (
    <section className="text-white">
      <div className="relative h-96 -mx-12 -mt-21">
        <div
          className="absolute inset-0 -mx-12 -mt-24 bg-gradient-to-t from-[var(--tw-gradient-from)] via-[var(--tw-gradient-via)] to-[var(--tw-gradient-to)]"
          style={
            {
              "--tw-gradient-from": gradient?.from,
              "--tw-gradient-via": gradient?.via,
              "--tw-gradient-to": gradient?.to,
            } as React.CSSProperties
          }
        />
        <div className="absolute left-12 bottom-6 flex items-end gap-6">
          <ArtistImage
            alt={name}
            src={imageId}
            size="xl"
            onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
            priority
          />
          <div className="flex flex-col gap-2">
            {isVerified && (
              <div className="flex gap-2 items-center">
                <BadgeCheckIcon className="stroke-white fill-sky-500 size-8" />
                Verified Artist
              </div>
            )}
            <p className="font-extrabold text-6xl mt-1 mb-4">{name}</p>
            <p className="font-medium">{monthlyListeners} monthly listeners</p>
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
