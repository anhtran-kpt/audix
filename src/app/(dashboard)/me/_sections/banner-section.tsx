"use client";

import { useImageGradient } from "@/hooks/use-image-gradient";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CopyIcon, EditIcon } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { AppImage } from "@/components/shared/app-image";
import { NavLink } from "@/components/ui/nav-link";
import pluralize from "pluralize";
import Dot from "@/components/ui/dot";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import Image from "next/image";

export const BannerSection = () => {
  const { data: me, status } = useQuery({
    ...meQueryOptions.banner(),
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section
      className="transition-colors -mx-responsive -mt-[calc(var(--spacing-responsive)+var(--header-height))] px-responsive flex flex-col gap-6 xl:gap-8"
      style={{
        background: gradient
          ? `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.via} 60%, ${gradient.to} 100%)`
          : undefined,
      }}
    >
      <div className="mt-[calc(var(--spacing-responsive)+var(--header-height))] flex flex-col sm:flex-row justify-start sm:items-end sm:gap-5 xl:gap-6">
        {me.image && me.image.startsWith("https") ? (
          <div className="size-72 sm:size-42 md:size-48 lg:size-52 xl:size-56 max-sm:place-self-center rounded-full relative">
            <Image
              alt={me.name ?? "profile"}
              src={me.image}
              className="rounded-full size-56 object-cover"
              fill
              onLoad={(e) => {
                setImageUrl((e.target as HTMLImageElement).src);
              }}
              priority
              sizes="224px"
            />
          </div>
        ) : (
          <AppImage
            priority
            alt={me.name ?? "profile"}
            src={me.image ?? process.env.NEXT_PUBLIC_FALLBACK_USER_COVER!}
            className="rounded-full"
            sizes="(max-width: 768px) 50vw, 224px"
            containerClassName="size-72 sm:size-42 md:size-48 lg:size-52 xl:size-56 max-sm:place-self-center rounded-full"
            onLoad={(e) => {
              setImageUrl((e.target as HTMLImageElement).src);
            }}
          />
        )}
        <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6 max-sm:mt-6">
          <span className="max-sm:hidden">Profile</span>
          <span className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            {me.name}
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {`${me._count.playlists} Public ${pluralize(
                  "Playlist",
                  me._count.playlists
                )}`}
              </span>
              <Dot />
              <NavLink href={`/me/following`} className="text-sm">
                {me._count.followedArtists} following
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start gap-6">
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
