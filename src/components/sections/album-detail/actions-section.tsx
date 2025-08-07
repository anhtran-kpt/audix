"use client";

import { EllipsisIcon, ShuffleIcon } from "lucide-react";
import { TFullAlbum } from "@/types";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import PlayButton from "@/components/ui/play-button";

type ActionsSectionProps = Pick<TFullAlbum, "title">;

export const ActionsSection = ({ title }: ActionsSectionProps) => {
  return (
    <section className="flex items-center gap-6">
      <PlayButton />
      <IconButton
        icon={ShuffleIcon}
        size="xl"
        tooltipContent={
          <>
            Enable shuffle for <strong>{title}</strong>
          </>
        }
      />
      <Button variant="outline" className="rounded-full">
        Follow
      </Button>
      <IconButton
        icon={EllipsisIcon}
        size="xl"
        tooltipContent={
          <>
            More options for <strong>{title}</strong>
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
