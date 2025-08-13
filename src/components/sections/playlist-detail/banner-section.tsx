"use client";

import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { TFullPlaylist } from "@/types";
import { CoverImage } from "@/components/ui/cover-image";
import { NavLink } from "@/components/ui/nav-link";
import Dot from "@/components/ui/dot";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";
import { FallbackCoverImage } from "@/components/features/fallback-cover-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type BannerSectionProps = Pick<
  TFullPlaylist,
  | "imageId"
  | "title"
  | "totalTracks"
  | "duration"
  | "isPublic"
  | "user"
  | "description"
>;

export const BannerSection = ({
  imageId,
  title,
  totalTracks,
  duration,
  isPublic,
  user,
  description,
}: BannerSectionProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { gradient } = useImageGradient(imageUrl);

  return (
    <section className="text-white">
      <div className="relative h-96 -mx-12 -mt-15">
        <div
          className="absolute inset-0 -mx-12 -mt-15 bg-gradient-to-t from-[var(--tw-gradient-from)] via-[var(--tw-gradient-via)] to-[var(--tw-gradient-to)]"
          style={
            {
              "--tw-gradient-from": gradient?.from,
              "--tw-gradient-via": gradient?.via,
              "--tw-gradient-to": gradient?.to,
            } as React.CSSProperties
          }
        />
        <div className="absolute left-12 bottom-6 flex items-end gap-6">
          {imageId ? (
            <CoverImage
              alt={title}
              src={imageId}
              size="xl"
              onLoad={(e) => setImageUrl((e.target as HTMLImageElement).src)}
              priority
            />
          ) : (
            <FallbackCoverImage type="detail" />
          )}
          <div className="flex flex-col gap-3">
            <p className="font-medium">
              {isPublic ? "Public" : "Private"} Playlist
            </p>
            <p className="font-bold text-6xl mt-1 mb-3">{title}</p>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <div className="inline-flex items-center gap-2">
              {user ? (
                <>
                  <Avatar>
                    <AvatarImage src={user.image as string} />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>
                  <NavLink href={`/users/${user.id}`} className="text-sm">
                    {user.name}
                  </NavLink>
                </>
              ) : (
                <>
                  <span>Audix</span>
                </>
              )}
              <div className="flex items-center gap-2">
                {totalTracks > 0 && (
                  <>
                    <Dot />
                    <span>
                      {`${totalTracks} ${pluralize(
                        "tracks",
                        totalTracks
                      )}, ${prettyMilliseconds(duration * 1000)}`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
