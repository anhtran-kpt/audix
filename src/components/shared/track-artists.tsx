import ExplicitIcon from "../ui/explicit-icon";
import { NavLink } from "../ui/nav-link";
import { TrackArtist } from "@/features/artist/contracts/artist-dto";

type TrackArtistsProps = {
  isExplicit?: boolean;
  artists: TrackArtist[];
};

export default function TrackArtists({
  isExplicit,
  artists,
}: TrackArtistsProps) {
  return (
    <div className="flex items-center text-sm gap-x-1.5 text-muted-foreground truncate">
      {isExplicit && <ExplicitIcon />}
      {artists.map((artist, index, originalArr) => (
        <span key={artist.id} className="truncate">
          <NavLink href={`/artists/${artist.id}`}>{artist.name}</NavLink>
          {index < originalArr.length - 1 && ", "}
        </span>
      ))}
    </div>
  );
}
