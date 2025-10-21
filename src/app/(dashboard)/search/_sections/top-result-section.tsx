"use client";

import { AppImage } from "@/components/shared/app-image";
import Dot from "@/components/ui/dot";
import { NavLink } from "@/components/ui/nav-link";
import SectionHeading from "@/components/ui/section-heading";
import { SearchResults } from "@/features/search/data-access/search-repo";
import { albumTypeMap } from "@/lib/constants/enum-maps";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlaybackContextType } from "@/app/generated/prisma";
import { formatDate } from "date-fns/format";
import { RoundedPlayContextButton } from "@/components/features/play/rounded-play-context-button";

type TopResultSectionProps = {
  topResult: SearchResults["topResult"];
};

export default function TopResultSection({ topResult }: TopResultSectionProps) {
  const router = useRouter();

  if (!topResult) {
    return null;
  }

  const { item, type } = topResult;

  const contextTypeMap = {
    artists: "ARTIST",
    tracks: "TRACK",
    playlists: "PLAYLIST",
    albums: "ALBUM",
  };

  let element;

  if (type === "tracks") {
    element = (
      <div className="flex flex-col group gap-4 overflow-hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => router.push(`/albums/${item.album.id}`)}
        >
          <AppImage
            alt={item.album.title}
            src={item.album.imageId}
            className="group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
            containerClassName="size-40 sm:size-48 lg:size-52 xl:size-56"
            sizes="20vw"
          />
        </div>
        <div className="flex flex-col items-start w-full min-w-0 overflow-hidden">
          <NavLink
            href={`/albums/${item.album.id}`}
            className="text-[calc(17rem/16)] truncate block w-full"
          >
            {item.album.title}
          </NavLink>
          <div className="flex text-[calc(15rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
            <span>Track</span>
            <Dot />
            <NavLink
              href={`/artists/${item.album.artist.id}`}
              className="text-[calc(15rem/16)] truncate block w-full"
            >
              {item.album.artist.name}
            </NavLink>
          </div>
        </div>
      </div>
    );
  } else if (type === "albums") {
    element = (
      <div className="flex flex-col group gap-2 overflow-hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => router.push(`/albums/${item.id}`)}
        >
          <AppImage
            alt={item.title}
            src={item.imageId}
            className="group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
            containerClassName="size-40 sm:size-48 lg:size-52 xl:size-56"
            sizes="20vw"
          />
        </div>
        <div className="flex flex-col items-start w-full min-w-0 overflow-hidden">
          <NavLink
            href={`/albums/${item.id}`}
            className="text-[calc(15rem/16)] truncate block w-full"
          >
            {item.title}
          </NavLink>
          <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
            {item.releaseDate ? (
              <>
                <span>{formatDate(item.releaseDate, "yyyy")}</span>
                <Dot />
                <span>{albumTypeMap[item.albumType]}</span>
              </>
            ) : (
              <>
                <span>{albumTypeMap[item.albumType]}</span>
                <Dot />
                <NavLink
                  href={`/albums/${item.artist.id}`}
                  className="text-[calc(13rem/16)] truncate block w-full"
                >
                  {item.artist.name}
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    );
  } else if (type === "artists") {
    element = (
      <div className="flex flex-col group gap-2 overflow-hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => router.push(`/artists/${item.id}`)}
        >
          <AppImage
            alt={item.name}
            src={item.imageId}
            className="rounded-full group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
            containerClassName="size-40 sm:size-48 lg:size-52 xl:size-56 rounded-full"
            sizes="20vw"
          />
        </div>
        <div className="flex flex-col items-start w-full min-w-0">
          <NavLink
            href={`/artists/${item.id}`}
            className="text-[calc(15rem/16)] truncate block w-full"
          >
            {item.name}
          </NavLink>
          <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
            <span>Artist</span>
          </div>
        </div>
      </div>
    );
  } else if (type === "playlists") {
    element = (
      <div className="flex flex-col group gap-2 overflow-hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => router.push(`/playlists/${item.id}`)}
        >
          <AppImage
            alt={item.title}
            src={
              item.imageId ?? process.env.NEXT_PUBLIC_FALLBACK_PLAYLIST_COVER!
            }
            className="group-hover:brightness-65 group-hover:scale-105 transition-all duration-400"
            containerClassName="size-40 sm:size-48 lg:size-52 xl:size-56"
            sizes="20vw"
          />
        </div>

        <div className="flex flex-col items-start w-full min-w-0">
          <NavLink
            href={`/playlists/${item.id}`}
            className="text-[calc(15rem/16)] truncate block w-full"
          >
            {item.title}
          </NavLink>
          <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
            <span>Playlist</span>
            {item.user && (
              <>
                <Dot />
                <div className="space-x-1">
                  <span>By</span>
                  <NavLink href={`users/${item.user.id}`}>
                    {item.user.name}
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  } else if (type === "profiles") {
    element = (
      <div className="flex flex-col group gap-2 overflow-hidden">
        <div
          className="relative cursor-pointer group"
          onClick={() => router.push(`/users/${item.id}`)}
        >
          {item.image && item.image.startsWith("https") ? (
            <div className="rounded-full relative size-40 sm:size-48 lg:size-52 xl:size-56 overflow-hidden">
              <Image
                alt={item.name ?? "profile"}
                src={item.image}
                className="rounded-full size-56 object-cover group-hover:scale-105 transition-transform duration-300"
                fill
                priority
                sizes="224px"
              />
            </div>
          ) : (
            <AppImage
              priority
              alt={item.name ?? "profile"}
              src={item.image ?? process.env.NEXT_PUBLIC_FALLBACK_USER_COVER!}
              className="rounded-full group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 224px"
              containerClassName="size-40 sm:size-48 lg:size-52 xl:size-56 rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col items-start w-full min-w-0">
          <NavLink
            href={`/users/${item.id}`}
            className="text-[calc(15rem/16)] truncate block w-full"
          >
            {item.name}
          </NavLink>
          <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
            <span>Profile</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col">
      <SectionHeading title="Top Result" />
      <div className="relative overflow-hidden bg-muted/60 rounded-lg group p-4 xl:p-5 flex h-full items-start gap-4">
        {element}
        {type !== "profiles" && (
          <RoundedPlayContextButton
            context={{
              contextType: contextTypeMap[type] as PlaybackContextType,
              contextId: item.id,
            }}
            className="absolute opacity-0 bottom-4 xl:bottom-5 right-4 xl:right-5 translate-y-2 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          />
        )}
      </div>
    </section>
  );
}
