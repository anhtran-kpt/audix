import { albumTypeMap } from "@/lib/constants/enum-maps";
import { formatDate } from "date-fns";
import { NavLink } from "../ui/nav-link";
import { cn } from "@/lib/utils";
import { CldImage } from "next-cloudinary";
import Dot from "../ui/dot";
import { ContextPlayButton } from "./context-play-button";
import { AlbumBase } from "@/features/album/contracts/album-dto";

type AlbumItemProps = Pick<
  AlbumBase,
  "imageId" | "id" | "title" | "releaseDate" | "albumType"
>;

export const AlbumItem = ({
  imageId,
  title,
  id,
  releaseDate,
  albumType,
}: AlbumItemProps) => {
  return (
    <div key={id} className="flex flex-col group gap-2 overflow-hidden">
      <div className="relative rounded-md overflow-hidden size-full aspect-square">
        <CldImage
          src={imageId}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 group-hover:brightness-75"
          sizes="20vw"
        />
        <ContextPlayButton
          context={{
            type: "ALBUM",
            contextId: id,
          }}
          className={cn(
            "absolute bottom-2 right-2",
            "opacity-0 translate-y-2 scale-95",
            "transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          )}
        />
      </div>
      <div className="flex flex-col items-start w-full min-w-0">
        <NavLink
          href={`/albums/${id}`}
          className="text-[calc(15rem/16)] truncate w-full"
        >
          {title}
        </NavLink>
        <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
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
