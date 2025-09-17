import { albumTypeMap } from "@/lib/constants/enum-maps";
import { formatDate } from "date-fns";
import { NavLink } from "../ui/nav-link";
import Dot from "../ui/dot";
import { AlbumItem as AlbumItemType } from "@/features/album/contracts/album-dto";
import SquareImage from "./square-image";

export const AlbumItem = ({
  imageId,
  title,
  id,
  releaseDate,
  albumType,
}: AlbumItemType) => {
  return (
    <div className="flex flex-col group gap-2 overflow-hidden">
      <SquareImage
        variant="large"
        alt={title}
        src={imageId}
        context={{
          type: "ALBUM",
          contextId: id,
        }}
      />
      <div className="flex flex-col items-start w-full min-w-0">
        <NavLink href={`/albums/${id}`} className="text-15 truncate w-full">
          {title}
        </NavLink>
        <div className="flex text-13 text-muted-foreground items-center gap-1.5 mt-0.5">
          {releaseDate && (
            <>
              <span>{formatDate(releaseDate, "yyyy")}</span>
              <Dot />
            </>
          )}
          <span>{albumTypeMap[albumType]}</span>
        </div>
      </div>
    </div>
  );
};
