"use client";

import SectionHeading from "../../../../components/ui/section-heading";
import Link from "next/link";
import Dot from "../../../../components/ui/dot";
import { FollowersBadge } from "../../../../components/features/follow-badge";
import { AppImage } from "@/components/shared/app-image";
import { RoundedPlayButton } from "@/components/shared/context-play-button/rounded-play-button";
import { SearchResults } from "@/features/search/data-access/search-repo";
import { NavLink } from "@/components/ui/nav-link";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { useRouter } from "next/navigation";

type TopResultSectionProps = {
  topResult: SearchResults["topResult"];
  q: string;
};

export default function TopResultSection({
  topResult,
  q,
}: TopResultSectionProps) {
  const router = useRouter();

  if (!topResult) {
    return null;
  }

  if (topResult.type === "artists") {
    return (
      <section>
        <SectionHeading title="Top Result" />
        <div className="relative overflow-hidden bg-muted/60 rounded-lg group p-5 flex items-end gap-4">
          <AppImage
            alt={topResult.item.name}
            src={topResult.item.imageId}
            containerClassName="size-40 rounded-full"
            sizes="160px"
          />
          <RoundedPlayButton
            context={{
              contextType: "ARTIST",
              contextId: topResult.item.id,
            }}
            className="absolute bottom-5 right-5 opacity-0 translate-y-2 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          />
          <div className="space-y-3 bottom-5 left-5">
            <div>
              <Link
                href={`/artists/${topResult.item.id}`}
                className="font-semibold text-2xl hover:underline underline-offset-4 hover:text-primary transition-colors duration-200"
              >
                {topResult.item.name}
              </Link>
            </div>
            <div>
              <FollowersBadge artistId={topResult.item.id} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (topResult.type === "albums") {
    return (
      <section>
        <SectionHeading title="Top Result" />
        <div className="relative overflow-hidden bg-muted/60 rounded-lg group p-5 flex flex-col gap-4">
          <AppImage
            alt={topResult.item.title}
            src={topResult.item.imageId}
            containerClassName="size-40"
            sizes="160px"
          />
          <RoundedPlayButton
            context={{
              contextType: "ALBUM",
              contextId: topResult.item.id,
            }}
            className="absolute bottom-5 right-5 opacity-0 translate-y-2 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          />
          <div className="space-y-2">
            <NavLink href={`/albums/${topResult.item.id}`} className="text-xl">
              {topResult.item.title}
            </NavLink>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {albumTypeMap[topResult.item.albumType]}
              </span>
              <Dot />
              <NavLink
                href={`/albums/${topResult.item.artist.id}`}
                className="text-[calc(15rem/16)]"
              >
                {topResult.item.artist.name}
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (topResult.type === "playlists") {
    return (
      <section>
        <SectionHeading title="Top Result" />
        <div
          key={topResult.item.id}
          className="flex flex-col group gap-2 overflow-hidden"
        >
          <div
            className="relative cursor-pointer"
            onClick={() => router.push(`/playlists/${topResult.item.id}`)}
          >
            <AppImage
              alt={topResult.item.title}
              src={
                topResult.item.imageId ??
                process.env.NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!
              }
              className="group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
              sizes="20vw"
            />
            <RoundedPlayButton
              context={{
                contextType: "PLAYLIST",
                contextId: topResult.item.id,
              }}
              className="absolute opacity-0 bottom-2 right-2 translate-y-2 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
            />
          </div>

          <div className="flex flex-col items-start w-full min-w-0">
            <NavLink
              href={`/playlists/${topResult.item.id}`}
              className="text-[calc(15rem/16)] truncate w-full"
            >
              {topResult.item.title}
            </NavLink>
            <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
              <span>Playlist</span>
              {topResult.item.user && (
                <>
                  <Dot />
                  <div className="space-x-1">
                    <span>By</span>
                    <NavLink href={`users/${topResult.item.user.id}`}>
                      {topResult.item.user.name}
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeading title="Top Result" />
      <div className="relative bg-muted/60 rounded-lg group hover:bg-muted transition-colors duration-400 p-5 flex flex-col gap-6">
        <AppImage
          alt={topResult.item.title}
          src={topResult.item.album.imageId}
          containerClassName="size-40"
          sizes="160px"
        />
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <h3 className="font-semibold text-2xl">{topResult.item.title}</h3>
          <div className="flex items-center gap-1.5">
            <span className="capitalize text-muted-foreground">
              {topResult.type}
            </span>
            <Dot />
            {topResult.item.artists.map((artist, index, originalArr) => (
              <span key={artist.id} className="truncate">
                <Link
                  href={`/artists/${artist.id}`}
                  className="text-[calc(13rem/16)] hover:text-primary hover:underline underline-offset-3 truncate font-medium"
                >
                  {artist.name}
                </Link>
                {index < originalArr.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
        <RoundedPlayButton
          context={{ contextType: "SEARCH", contextId: q }}
          className="absolute opacity-0 bottom-5 right-5 translate-y-5 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
        />
      </div>
    </section>
  );
}
