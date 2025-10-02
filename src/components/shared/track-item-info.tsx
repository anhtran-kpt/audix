import { cn } from "@/lib/utils";
import ExplicitIcon from "../ui/explicit-icon";
import { NavLink } from "../ui/nav-link";
import { TrackItem } from "@/features/track/contracts/track-dto";

type TrackInfoProps = {
  title: string;
  isExplicit?: boolean;
  artists: TrackItem["artists"];
  isActiveTrack: boolean;
};

export const TrackItemInfo = ({
  title,
  isExplicit,
  artists,
  isActiveTrack,
}: TrackInfoProps) => {
  console.log(artists);
  return (
    <div className="flex flex-col gap-0.5 flex-1 min-w-0 overflow-hidden">
      <p
        className={cn(
          "font-medium truncate text-foreground text-sm select-none",
          isActiveTrack && "text-primary"
        )}
      >
        {title}
      </p>
      <div className="flex items-center text-sm gap-x-1.5 text-muted-foreground truncate">
        {isExplicit && <ExplicitIcon />}
        {artists.map((artist, index, originalArr) => (
          <span key={artist.id} className="truncate">
            <NavLink href={`/artists/${artist.id}`}>{artist.name}</NavLink>
            {index < originalArr.length - 1 && ", "}
          </span>
        ))}
      </div>
    </div>
  );
};
