"use client";

import { CopyIcon, EditIcon } from "lucide-react";
import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import tinycolor from "tinycolor2";
import { IconButton } from "@/components/ui/icon-button";
import { MyProfile } from "@/features/me/data-access/me-repo";
import { FallbackCoverImage } from "@/components/features/fallback-cover-image";
import pluralize from "pluralize";
import Dot from "@/components/ui/dot";
import { NavLink } from "@/components/ui/nav-link";
import Image from "next/image";

type BannerSectionProps = {
  image: MyProfile["image"];
  name: MyProfile["name"];
  playlistCount: MyProfile["_count"]["playlists"];
  followingCount: MyProfile["_count"]["followedArtists"];
};

export const BannerSection = ({
  image,
  name,
  playlistCount,
  followingCount,
}: BannerSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  const from = gradient?.from ?? "transparent";
  const via = gradient?.via ?? from;
  const toT = tinycolor(gradient?.to ?? from)
    .setAlpha(0)
    .toRgbString();

  return (
    <section
      className="relative -mx-12 -mt-30 space-y-8 transition-colors"
      style={{
        backgroundImage: `linear-gradient(180deg, ${from} 0%, ${via} 50%, ${toT} 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 30rem",
      }}
    >
      <div className="relative h-[calc(108rem/4)]">
        <div className="absolute left-12 bottom-6 flex items-end gap-6">
          {image ? (
            <div className="relative size-56 overflow-hidden shrink-0 aspect-square rounded-sm">
              <Image
                priority
                alt={name ?? "profile"}
                src={image}
                className="rounded-full"
                sizes="(max-width: 768px) 50vw, 224px"
                fill
                onLoad={(e) => {
                  setImageUrl((e.target as HTMLImageElement).src);
                }}
              />
            </div>
          ) : (
            <FallbackCoverImage type="detail" />
          )}

          <div className="flex flex-col gap-3">
            Profile
            <p className="font-extrabold text-6xl mt-1 mb-3">{name}</p>
            <div className="inline-flex items-center gap-2">
              <span className="text-muted-foreground">
                {`${playlistCount} Public ${pluralize(
                  "Playlist",
                  playlistCount
                )}`}
              </span>
              <Dot />
              <NavLink href={`/me/following`} className="text-sm">
                {followingCount} following
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 px-12">
        <IconButton
          icon={EditIcon}
          size="xl"
          tooltipContent={<>Edit profile</>}
        />
        <IconButton
          icon={CopyIcon}
          size="xl"
          tooltipContent={<>Copy link to profile</>}
        />
      </div>
    </section>
  );
};
