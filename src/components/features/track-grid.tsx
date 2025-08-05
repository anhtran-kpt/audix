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
import { TrackCover } from "../ui/track-cover";
import { useAudioPlayer, useIsPlaying } from "@/hooks/use-audio-player";
import { Skeleton } from "../ui/skeleton";
import { IconButton } from "../ui/icon-button";
import { formatDuration } from "@/lib/helpers/format-duration";
import { NavLink } from "../ui/nav-link";
import WaveForm from "../ui/wave-form";

interface TrackGridProps {
  type: "album" | "popular" | "playlist";
}

export const TrackGrid = ({ type, tracks }: TrackGridProps) => {
  const gridClass =
    "grid w-full items-center grid-cols-[3rem_1fr_9rem_6rem_4rem_3rem]";

  const { playTrack, currentTrack } = useAudioPlayer();
  const isPlaying = useIsPlaying();

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
      {tracks.map((track, trackIndex) => {
        const isActive = currentTrack?.id === track.id;
        const length = track.collaborators.length;
        const trackTitle =
          type === "popular" && length > 0
            ? `${track.title} (feat. ${track.collaborators?.reduce(
                (acc, artist, index) => {
                  if (index < length - 1) {
                    return acc + artist.name + ", ";
                  }
                  return acc + artist.name;
                },
                ""
              )})`
            : track.title;

        return (
          <div
            key={track.slug}
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
                  <span className="group-hover:hidden">{trackIndex + 1}</span>
                  <IconButton
                    icon={PlayIcon}
                    size="sm"
                    onClick={() => playTrack(track)}
                    iconClassName="fill-foreground stroke-0"
                    className="hidden group-hover:block"
                  />
                </>
              )}
            </div>

            <div className="flex gap-3">
              {type === "popular" && (
                <TrackCover
                  alt={track.title}
                  publicId={track.album.coverPublicId}
                />
              )}
              <div className="flex flex-col gap-0.5 justify-center">
                <ItemTitle title={trackTitle} isActive={isActive} />
                <div className="flex gap-1.5 items-center">
                  {track.isExplicit && <Explicit />}
                  {type !== "popular" &&
                    track.artists.map((artist, artistIndex) => (
                      <span key={artist.slug}>
                        <NavLink
                          href={`/artists/${artist.slug}`}
                          className="text-[calc(13rem/16)]"
                        >
                          {artist.name}
                        </NavLink>
                        {artistIndex < track.artists.length - 1 && ", "}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="text-right">{track.plays.toLocaleString()}</div>

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

            <div className="text-right">{formatDuration(track.duration)}</div>

            <div className="invisible group-hover:visible text-right">
              <IconButton
                icon={EllipsisIcon}
                className="text-current"
                tooltipContent={
                  <>
                    More options for <strong>{track.title}</strong>
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

// interface TrackGridSkeletonProps {
//   type?: "popular" | "default";
//   count?: number;
// }

// export const TrackGridSkeleton = ({
//   type = "default",
//   count = 10,
// }: TrackGridSkeletonProps) => {
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
