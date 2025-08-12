"use client";

import {
  DownloadIcon,
  EditIcon,
  EllipsisIcon,
  ListIcon,
  SearchIcon,
  ShuffleIcon,
  SortDescIcon,
  UserPlus2Icon,
} from "lucide-react";
import { TFullPlaylist } from "@/types";
import { IconButton } from "@/components/ui/icon-button";
import PlayButton from "@/components/ui/play-button";

type ActionsSectionProps = Pick<TFullPlaylist, "title">;

export const ActionsSection = ({ title }: ActionsSectionProps) => {
  return (
    <section className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-6">
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
        <IconButton
          icon={DownloadIcon}
          size="xl"
          tooltipContent={<>Download</>}
        />
        <IconButton
          icon={UserPlus2Icon}
          size="xl"
          tooltipContent={
            <>
              Invite collaborators to <strong>{title}</strong>
            </>
          }
        />
        <IconButton
          icon={EditIcon}
          size="xl"
          tooltipContent={<>Edit details</>}
        />
        <IconButton
          icon={EllipsisIcon}
          size="xl"
          tooltipContent={
            <>
              More options for <strong>{title}</strong>
            </>
          }
        />
      </div>
      <div className="flex items-center gap-6">
        <IconButton
          icon={SearchIcon}
          size="lg"
          tooltipContent={
            <>
              Search in <strong>{title}</strong>
            </>
          }
        />
        <IconButton
          icon={SortDescIcon}
          size="lg"
          tooltipContent={<>Sort by</>}
        />
        <IconButton icon={ListIcon} size="lg" tooltipContent={<>View as</>} />
      </div>
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
