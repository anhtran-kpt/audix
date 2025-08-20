import { useTracks } from "@/hooks/api/use-tracks";
import {
  useIsPlaying,
  useNowPlayingId,
  useQueue,
} from "@/hooks/use-audio-player";
import { useMemo } from "react";
import { CldImage } from "next-cloudinary";
import { IconButton } from "../ui/icon-button";
import { ItemTitle } from "../ui/item-title";
import Explicit from "../ui/explicit";
import { NavLink } from "../ui/nav-link";
import { EllipsisIcon, PauseIcon, PlayIcon } from "lucide-react";

export default function UpNextList() {
  const nowPlayingId = useNowPlayingId();
  const isPlaying = useIsPlaying();
  const { upNext, skipToUpNextIndex } = useQueue();
  const trackIds = useMemo(() => upNext.map((ref) => ref.id), [upNext]);
  const { data: queueTracks } = useTracks(trackIds);

  return (
    <ol role="list" className="flex flex-col gap-2 px-1">
      {queueTracks?.map((track, i) => (
        <li
          key={track.id}
          className="flex items-center justify-between gap-4 group hover:bg-muted py-2 px-3 rounded-sm"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative overflow-hidden rounded-sm aspect-square shrink-0 size-12">
              <CldImage
                className="object-cover group-hover:brightness-65"
                alt={track.title}
                src={track.album.imageId}
                fill
                sizes="48px"
              />
              <IconButton
                icon={
                  isPlaying && nowPlayingId === track.id ? PauseIcon : PlayIcon
                }
                size="sm"
                onClick={() => skipToUpNextIndex(i)}
                iconClassName="fill-foreground stroke-0 size-5"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
              />
            </div>
            <div className="flex flex-col gap-0.5 w-full overflow-hidden">
              <ItemTitle
                title={track.title}
                isActive={nowPlayingId === track.id}
              />
              <div className="flex items-center text-sm gap-x-1 text-muted-foreground truncate">
                {track.isExplicit && <Explicit />}
                {track.artists.map(({ artist }, index, originalArr) => (
                  <span key={artist.id}>
                    <NavLink href={`/artists/${artist.id}`}>
                      {artist.name}
                    </NavLink>
                    {index < originalArr.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <IconButton
            icon={EllipsisIcon}
            className="group-hover:visible invisible shrink-0"
            tooltipContent={
              <>
                More options for <strong>{track.title}</strong>
              </>
            }
          />
        </li>
      ))}
    </ol>
  );
}
