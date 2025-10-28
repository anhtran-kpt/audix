"use client";

import { GridWrapper } from "./grid-wrapper";
import { NavLink } from "../ui/nav-link";
import Dot from "../ui/dot";
import { formatDate } from "date-fns/format";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { AppImage } from "./app-image";
import { useRouter } from "next/navigation";
import { AlbumItem } from "@/features/album/contracts/album-dto";
import { RoundedPlayContextButton } from "../features/play/rounded-play-context-button";
import { Skeleton } from "../ui/skeleton";

type AlbumGridProps = {
  albums: AlbumItem[];
  isLoading?: boolean;
};

export default function AlbumGrid({ albums, isLoading }: AlbumGridProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <GridWrapper>
        {albums.map((album) => (
          <div key={album.id} className="flex flex-col gap-2 overflow-hidden">
            <div className="relative">
              <Skeleton className="rounded-sm size-full aspect-square" />
            </div>
            <div className="flex flex-col items-start w-full min-w-0 gap-1">
              <Skeleton className="w-4/5 h-5" />
              <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
                <Skeleton className="w-32 h-5" />
              </div>
            </div>
          </div>
        ))}
      </GridWrapper>
    );
  }

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
            />
            <RoundedPlayContextButton
              context={{ contextType: "ALBUM", contextId: album.id }}
              className="absolute opacity-0 bottom-2 right-2 translate-y-2 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
            />
          </div>
          <div className="flex flex-col items-start w-full min-w-0 overflow-hidden">
            <NavLink
              href={`/albums/${album.id}`}
              className="text-[calc(15rem/16)] truncate block w-full"
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
                    href={`/artists/${album.artist.id}`}
                    className="text-[calc(13rem/16)] truncate block w-full"
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
