"use client";

import { cn } from "@/lib/utils";
import Explicit from "../ui/explicit";

import {
  Clock3Icon,
  EllipsisIcon,
  PlayIcon,
  PlusCircleIcon,
} from "lucide-react";
import { ItemTitle } from "../ui/item-title";
import { Skeleton } from "../ui/skeleton";
import { IconButton } from "../ui/icon-button";
import { formatDuration } from "@/lib/helpers/format-duration";
import { NavLink } from "../ui/nav-link";
import WaveForm from "../ui/wave-form";
import { CoverImage } from "../ui/cover-image";
import { usePlayerStore } from "@/stores/use-player-store";

interface SongGridProps {
  type: "album" | "popular" | "playlist";
}

export const SongGrid = ({ type, songs }: SongGridProps) => {
  const gridClass =
    "grid w-full items-center grid-cols-[3rem_1fr_9rem_6rem_4rem_3rem]";

  const { isPlaying, currentTrack, playTrack } = usePlayerStore();

  return (
    <div className="space-y-1 w-full">
      {type !== "popular" && (
        <div
          className={cn(
            gridClass,
            "text-muted-foreground font-medium pb-2 mb-4 border-b border-border pr-6"
          )}
        >
          <div className="text-center">#</div>
          <div className="text-left">Title</div>
          <div className="text-right">Plays</div>
          <div className="text-right"></div>
          <div className="flex justify-end">
            <Clock3Icon size={16} />
          </div>
          <div className=""></div>
        </div>
      )}
      {songs.map((song, songIndex) => {
        const isActive = currentTrack?.id === song.id;
        const length = song.collaborators.length;
        const songTitle =
          type === "popular" && length > 0
            ? `${song.title} (feat. ${song.collaborators?.reduce(
                (acc, artist, index) => {
                  if (index < length - 1) {
                    return acc + artist.name + ", ";
                  }
                  return acc + artist.name;
                },
                ""
              )})`
            : song.title;

        return (
          <div
            key={song.slug}
            className={cn(
              gridClass,
              "py-2 pr-6 items-center group hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex justify-center items-center text-base font-semibold">
              {isPlaying && isActive ? (
                <WaveForm />
              ) : (
                <>
                  <span className="group-hover:hidden">{songIndex + 1}</span>
                  <IconButton
                    icon={PlayIcon}
                    size="sm"
                    onClick={() => playTrack(song)}
                    iconClassName="fill-foreground stroke-0"
                    className="hidden group-hover:block"
                  />
                </>
              )}
            </div>

            <div className="flex gap-3">
              {type === "popular" && (
                <CoverImage alt={song.title} src={song.album.coverPublicId} />
              )}
              <div className="flex flex-col gap-0.5 justify-center">
                <ItemTitle title={songTitle} isActive={isActive} />
                <div className="flex gap-1.5 items-center">
                  {song.isExplicit && <Explicit />}
                  {type !== "popular" &&
                    song.artists.map((artist, artistIndex) => (
                      <span key={artist.slug}>
                        <NavLink
                          href={`/artists/${artist.slug}`}
                          className="text-[calc(13rem/16)]"
                        >
                          {artist.name}
                        </NavLink>
                        {artistIndex < song.artists.length - 1 && ", "}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="text-right">{song.plays.toLocaleString()}</div>

            <div className="invisible group-hover:visible text-right">
              <IconButton
                icon={PlusCircleIcon}
                className="text-current"
                size="sm"
                tooltipContent={
                  <>
                    Add to <strong>Liked Songs</strong>
                  </>
                }
              />
            </div>

            <div className="text-right">{formatDuration(song.duration)}</div>

            <div className="invisible group-hover:visible text-right">
              <IconButton
                icon={EllipsisIcon}
                className="text-current"
                tooltipContent={
                  <>
                    More options for <strong>{song.title}</strong>
                  </>
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// interface SongGridSkeletonProps {
//   type?: "popular" | "default";
//   count?: number;
// }

// export const SongGridSkeleton = ({
//   type = "default",
//   count = 10,
// }: SongGridSkeletonProps) => {
//   const gridClass =
//     "grid w-full items-center grid-cols-[3rem_1fr_9rem_6rem_4rem_3rem]";

//   return (
//     <div className="space-y-1 w-full">
//       {type !== "popular" && (
//         <div
//           className={cn(
//             gridClass,
//             "text-muted-foreground font-medium pb-2 mb-4 border-b border-border pr-6"
//           )}
//         >
//           <div className="text-center">#</div>
//           <div className="pl-2 text-left">Title</div>
//           <div className="text-right">Plays</div>
//           <div className="text-right"></div>
//           <div className="flex justify-end">
//             <Clock3Icon size={16} />
//           </div>
//           <div className=""></div>
//         </div>
//       )}

//       {Array.from({ length: count }).map((_, i) => (
//         <div
//           key={i}
//           className={cn(
//             gridClass,
//             "py-2 pr-6 items-center rounded-sm text-muted-foreground"
//           )}
//         >
//           {/* Index or play button */}
//           <div className="flex justify-center items-center">
//             <Skeleton className="h-5 w-5 rounded-sm" />
//           </div>

//           {/* Title + artist(s) */}
//           <div className="flex gap-2 items-center">
//             {type === "popular" && <Skeleton className="h-10 w-10 rounded" />}
//             <div className="flex flex-col gap-1 pl-2 w-full">
//               <Skeleton className="h-5 w-[60%]" />
//               <Skeleton className="h-4 w-[40%]" />
//             </div>
//           </div>

//           {/* Plays */}
//           <div className="text-right">
//             <Skeleton className="h-4 w-16 ml-auto" />
//           </div>

//           {/* Like button */}
//           <div className="text-right invisible">
//             <Skeleton className="h-4 w-4 ml-auto" />
//           </div>

//           {/* Duration */}
//           <div className="text-right">
//             <Skeleton className="h-4 w-8 ml-auto" />
//           </div>

//           {/* More button */}
//           <div className="text-right invisible">
//             <Skeleton className="h-4 w-4 ml-auto" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };
