import { ItemTitle } from "../ui/item-title";
import { useAudioPlayer, useNowPlayingId } from "@/hooks/use-audio-player";
import { NavLink } from "../ui/nav-link";
import { IconButton } from "../ui/icon-button";
import { EllipsisIcon, PauseIcon, PlayIcon } from "lucide-react";
import Explicit from "../ui/explicit";
import { CldImage } from "next-cloudinary";
import { FullTrack } from "@/server/modules/track/contracts";

export default function TrackItem({ track }: { track: FullTrack }) {
  const nowPlayingId = useNowPlayingId();
  const { playTrackRef, playback, controls } = useAudioPlayer();
  const isCurrentTrackPlaying = nowPlayingId === track.id && playback.isPlaying;

  return (
    <li className="flex items-center justify-between gap-4 group hover:bg-muted py-2 px-3 rounded-sm">
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
            icon={isCurrentTrackPlaying ? PauseIcon : PlayIcon}
            size="sm"
            onClick={
              isCurrentTrackPlaying
                ? () => controls.pause()
                : () => playTrackRef(track)
            }
            iconClassName="fill-foreground stroke-0 size-5"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
          />
        </div>
        <div className="flex flex-col gap-0.5 w-full overflow-hidden">
          <ItemTitle title={track.title} isActive={nowPlayingId === track.id} />
          <div className="flex items-center text-sm gap-x-1 text-muted-foreground truncate">
            {track.isExplicit && <Explicit />}
            {track.artists.map(({ artist }, index, originalArr) => (
              <span key={artist.id}>
                <NavLink href={`/artists/${artist.id}`}>{artist.name}</NavLink>
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
  );
}
