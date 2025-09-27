import { ArtistBase } from "@/features/artist/contracts/artist-dto";
import ExplicitIcon from "../ui/explicit-icon";
import { NavLink } from "../ui/nav-link";

type TrackArtistsProps = {
  isExplicit?: boolean;
  artists: {
    name: ArtistBase["name"];
    id: ArtistBase["id"];
  }[];
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
