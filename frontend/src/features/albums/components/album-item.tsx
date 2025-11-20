"use client";

import { AppImage } from "@/components/shared/app-image";
import { AlbumItem as AlbumItemType } from "@/features/album/album-types";
import { useRouter } from "next/navigation";
import { RoundedPlayContextButton } from "../../../components/features/play/rounded-play-context-button";
import { NavLink } from "@/components/ui/nav-link";
import { formatDate } from "date-fns/format";
import Dot from "@/components/ui/dot";
import { albumTypeMap } from "@/lib/constants/enum-maps";

export const AlbumItem = ({ album }: { album: AlbumItemType }) => {
  const router = useRouter();

  return (
    <div key={album.id} className="flex flex-col group gap-2 overflow-hidden">
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

        {album.releaseDate ? (
          <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
            <span>{formatDate(album.releaseDate, "yyyy")}</span>
            <Dot />
            <span>{albumTypeMap[album.albumType]}</span>
          </div>
        ) : (
          <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
            <span>{albumTypeMap[album.albumType]}</span>
            <Dot />
            <NavLink
              href={`/artists/${album.artist.id}`}
              className="text-[calc(13rem/16)] truncate block w-full"
            >
              {album.artist.name}
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};
