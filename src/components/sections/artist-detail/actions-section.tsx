"use client";

import { EllipsisIcon, ShuffleIcon } from "lucide-react";
import { TFullArtist } from "@/types";
import { IconButton } from "@/components/ui/icon-button";
import PlayButton from "@/components/ui/play-button";
import { FollowButton } from "@/components/features/follow-button";

type ActionsSectionProps = Pick<TFullArtist, "name">;

export const ActionsSection = ({ name }: ActionsSectionProps) => {
  return (
    <section className="flex items-center gap-6">
      <PlayButton />
      <IconButton
        icon={ShuffleIcon}
        size="xl"
        tooltipContent={
          <>
            Enable shuffle for <strong>{name}</strong>
          </>
        }
      />
      <FollowButton />
      <IconButton
        icon={EllipsisIcon}
        size="xl"
        tooltipContent={
          <>
            More options for <strong>{name}</strong>
          </>
        }
      />
    </section>
  );
};

// export const ArtistActionsSkeleton = () => {
//   return (
//     <section className="flex items-center gap-5">
//       <Skeleton className="rounded-full size-12" />
//       <Skeleton className="rounded-full size-9" />
//       <Skeleton className="rounded-full h-9 w-24" />
//       <Skeleton className="rounded-full size-9" />
//     </section>
//   );
// };
