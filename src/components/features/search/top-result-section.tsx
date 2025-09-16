"use client";

import { SearchResult } from "@/features/search/contracts/search-dtos";
import SectionHeading from "../../ui/section-heading";
import { CoverImage } from "../../ui/cover-image";
import Link from "next/link";
import Dot from "../../ui/dot";
import { CldImage } from "next-cloudinary";
import { BadgeCheckIcon } from "lucide-react";
import { FollowersBadge } from "../follow-badge";
import { Badge } from "../../ui/badge";
import { ContextPlayButton } from "../context-play-button";

export default function TopResultSection({
  topResult,
}: {
  topResult: SearchResult["topResult"];
}) {
  console.log(topResult);
  if (topResult?.type === "artist") {
    return (
      <section>
        <SectionHeading title="Top Result" />
        <div className="relative overflow-hidden bg-muted/60 rounded-lg group p-5 space-y-5 aspect-video">
          <CldImage
            alt={topResult?.item.name}
            src={topResult?.item.bannerId}
            fill
            className="object-cover brightness-80 group-hover:brightness-60 transition-all duration-300"
          />
          <ContextPlayButton
            context={{
              type: "ARTIST",
              contextId: topResult.item.id,
            }}
            className="absolute bottom-0 right-5 opacity-0 translate-y-2 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          />
          <div className="space-y-3 absolute bottom-5 left-5">
            {topResult?.item.isVerified && (
              <div className="flex gap-2 items-center">
                <BadgeCheckIcon className="stroke-white fill-sky-500 size-8" />
                Verified Artist
              </div>
            )}
            <div>
              <Link
                href={`/artists/${topResult.item.id}`}
                className="font-semibold text-2xl hover:underline underline-offset-4 hover:text-primary transition-colors duration-200"
              >
                {topResult?.item.name}
              </Link>
            </div>
            <div>
              <FollowersBadge artistId={topResult.item.id} />
            </div>
            <div className="space-x-2">
              {topResult.item.genres.map(({ genre }) => (
                <Badge
                  key={genre.name}
                  style={{ backgroundColor: genre.color }}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeading title="Top Result" />
      <div className="bg-muted/60 rounded-lg group hover:bg-muted transition-colors duration-500 p-5 space-y-5">
        <CoverImage
          alt={topResult?.item.title}
          src={topResult?.item.album.imageId}
        />
        <div className="space-y-3">
          <h3 className="font-semibold text-2xl">{topResult?.item.title}</h3>
          <div className="flex items-center gap-1.5">
            <span className="capitalize text-muted-foreground">
              {topResult?.type}
            </span>
            <Dot />
            {topResult?.item.artists.map(({ artist }, index, originalArr) => (
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
      </div>
    </section>
  );
}
