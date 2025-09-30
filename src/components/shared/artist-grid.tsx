"use client";

import { useRouter } from "next/navigation";
import { GridWrapper } from "../ui/grid-wrapper";
import { NavLink } from "../ui/nav-link";
import { AppImage } from "./app-image";
import { ContextPlayButton } from "./context-play-button";
import { ArtistGridItem } from "@/features/artist/contracts/artist-dto";

type ArtistGridProps = {
  artists: ArtistGridItem[];
};

export default function ArtistGrid({ artists }: ArtistGridProps) {
  const router = useRouter();
  return (
    <GridWrapper>
      {artists.map((artist) => (
        <div
          key={artist.id}
          className="flex flex-col group gap-2 overflow-hidden"
        >
          <div
            className="relative cursor-pointer"
            onClick={() => router.push(`/artists/${artist.id}`)}
          >
            <AppImage
              alt={artist.name}
              src={artist.imageId}
              className="rounded-full group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
              containerClassName="rounded-full"
              sizes="20vw"
            />
            <ContextPlayButton
              context={{ contextType: "ARTIST", contextId: artist.id }}
              className="absolute opacity-0 bottom-2 right-2 translate-y-2 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
            />
          </div>
          <div className="flex flex-col items-start w-full min-w-0">
            <NavLink
              href={`/artists/${artist.id}`}
              className="text-15 truncate"
            >
              {artist.name}
            </NavLink>
            <div className="flex text-13 text-muted-foreground items-center gap-1.5 mt-0.5">
              <span>Artist</span>
            </div>
          </div>
        </div>
      ))}
    </GridWrapper>
  );
}
