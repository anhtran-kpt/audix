"use client";

import { GridWrapper } from "./grid-wrapper";
import { NavLink } from "../ui/nav-link";
import Dot from "../ui/dot";
import { formatDate } from "date-fns/format";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { AppImage } from "./app-image";
import { ContextPlayButton } from "./context-play-button";
import { useRouter } from "next/navigation";
import { AlbumItem } from "@/features/album/contracts/album-dto";

type AlbumGridProps = {
  albums: AlbumItem[];
};

export default function AlbumGrid({ albums }: AlbumGridProps) {
  const router = useRouter();
  return (
    <GridWrapper>
      {albums.map((album) => (
        <div
          key={album.id}
          className="flex flex-col group gap-2 overflow-hidden"
        >
          <div
            className="relative cursor-pointer"
            onClick={() => router.push(`/albums/${album.id}`)}
          >
            <AppImage
              alt={album.title}
              src={album.imageId}
              className="group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
              sizes="20vw"
            />
            <ContextPlayButton
              context={{ contextType: "ALBUM", contextId: album.id }}
              className="absolute opacity-0 bottom-2 right-2 translate-y-2 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
            />
          </div>
          <div className="flex flex-col items-start w-full min-w-0">
            <NavLink
              href={`/albums/${album.id}`}
              className="text-[calc(15rem/16)] truncate"
            >
              {album.title}
            </NavLink>
            <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
              {album.releaseDate ? (
                <>
                  <span>{formatDate(album.releaseDate, "yyyy")}</span>
                  <Dot />
                  <span>{albumTypeMap[album.albumType]}</span>
                </>
              ) : (
                <>
                  <span>{albumTypeMap[album.albumType]}</span>
                  <Dot />
                  <NavLink
                    href={`/albums/${album.artist.id}`}
                    className="text-[calc(13rem/16)] truncate"
                  >
                    {album.artist.name}
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </GridWrapper>
  );
}
