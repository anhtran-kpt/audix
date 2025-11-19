"use client";

import { AppImage } from "@/components/shared/app-image";
import { ArtistItem as ArtistItemType } from "@/features/artist/artist-types";
import { useRouter } from "next/navigation";
import { RoundedPlayContextButton } from "../../../components/features/play/rounded-play-context-button";
import { NavLink } from "@/components/ui/nav-link";

export const ArtistItem = ({ artist }: { artist: ArtistItemType }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col group gap-2 overflow-hidden">
      <div
        className="relative cursor-pointer"
        onClick={() => router.push(`/artists/${artist.id}`)}
      >
        <AppImage
          alt={artist.name}
          src={artist.imageId}
          className="rounded-full group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
          containerClassName="rounded-full"
        />
        <RoundedPlayContextButton
          context={{ contextType: "ARTIST", contextId: artist.id }}
          className="absolute opacity-0 bottom-2 right-2 translate-y-2 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
        />
      </div>
      <div className="flex flex-col items-start w-full min-w-0">
        <NavLink
          href={`/artists/${artist.id}`}
          className="text-[calc(15rem/16)] truncate block w-full"
        >
          {artist.name}
        </NavLink>
        <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
          <span>Artist</span>
        </div>
      </div>
    </div>
  );
};
