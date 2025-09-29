import { TrackArtist } from "@/features/artist/contracts/artist-dto";
import { cn } from "@/lib/utils";
import TrackArtists from "./track-artists";

type TrackInfoProps = {
  title: string;
  isExplicit?: boolean;
  artists: TrackArtist[];
  isActive: boolean;
};

export const TrackItemInfo = ({
  title,
  isExplicit,
  artists,
  isActive,
}: TrackInfoProps) => {
  return (
    <div className="flex flex-col gap-0.5 w-full overflow-hidden">
      <p
        className={cn(
          "font-medium truncate text-foreground text-sm select-none",
          isActive && "text-primary"
        )}
      >
        {title}
      </p>
      <TrackArtists isExplicit={isExplicit} artists={artists} />
    </div>
  );
};
