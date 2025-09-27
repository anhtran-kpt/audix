import { GridWrapper } from "../ui/grid-wrapper";
import LargeMediaCover from "./large-media-cover";
import { NavLink } from "../ui/nav-link";
import Dot from "../ui/dot";
import { formatDate } from "date-fns/format";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { AlbumGridItem } from "@/features/album/contracts/album-dto";

type AlbumGridProps = {
  albums: AlbumGridItem[];
};

export default function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <GridWrapper>
      {albums.map((album) => (
        <div
          key={album.id}
          className="flex flex-col group/large-cover gap-2 overflow-hidden"
        >
          <LargeMediaCover
            alt={album.title}
            src={album.imageId}
            context={{
              contextType: "ALBUM",
              contextId: album.id,
            }}
          />
          <div className="flex flex-col items-start w-full min-w-0">
            <NavLink href={`/albums/${album.id}`} className="text-15 truncate">
              {album.title}
            </NavLink>
            <div className="flex text-13 text-muted-foreground items-center gap-1.5 mt-0.5">
              {album.releaseDate && (
                <>
                  <span>{formatDate(album.releaseDate, "yyyy")}</span>
                  <Dot />
                </>
              )}
              <span>{albumTypeMap[album.albumType]}</span>
            </div>
          </div>
        </div>
      ))}
    </GridWrapper>
  );
}
