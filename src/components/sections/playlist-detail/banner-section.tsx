"use client";

import { useImageGradient } from "@/hooks/use-image-gradient";
import { useState } from "react";
import { CoverImage } from "@/components/ui/cover-image";
import { NavLink } from "@/components/ui/nav-link";
import Dot from "@/components/ui/dot";
import prettyMilliseconds from "pretty-ms";
import pluralize from "pluralize";
import { FallbackCoverImage } from "@/components/features/fallback-cover-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import {
  DownloadIcon,
  EditIcon,
  EllipsisIcon,
  ListIcon,
  SearchIcon,
  ShuffleIcon,
  SortDescIcon,
  UserPlus2Icon,
} from "lucide-react";
import tinycolor from "tinycolor2";
import { FullPlaylist } from "@/contracts/playlist";
import { ContextPlayButton } from "@/components/features/context-play-button";

type BannerSectionProps = Pick<
  FullPlaylist,
  | "id"
  | "imageId"
  | "title"
  | "totalTracks"
  | "duration"
  | "isPublic"
  | "user"
  | "description"
>;

export const BannerSection = ({
  id,
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

  const from = gradient?.from ?? "transparent";
  const via = gradient?.via ?? from;
  const toT = tinycolor(gradient?.to ?? from)
    .setAlpha(0)
    .toRgbString();

  return (
    <section
      className="relative text-white -mx-12 -mt-30 space-y-8"
      style={{
        backgroundImage: `linear-gradient(180deg, ${from} 0%, ${via} 50%, ${toT} 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 30rem",
      }}
    >
      <div className="relative h-[calc(108rem/4)]">
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
      <div className="flex items-center justify-between gap-6 px-12">
        <div className="flex items-center gap-6">
          <ContextPlayButton
            context={{ type: "PLAYLIST", contextId: id, name: title }}
          />
          <IconButton
            icon={ShuffleIcon}
            size="xl"
            tooltipContent={
              <>
                Enable shuffle for <strong>{title}</strong>
              </>
            }
          />
          <IconButton
            icon={DownloadIcon}
            size="xl"
            tooltipContent={<>Download</>}
          />
          <IconButton
            icon={UserPlus2Icon}
            size="xl"
            tooltipContent={
              <>
                Invite collaborators to <strong>{title}</strong>
              </>
            }
          />
          <IconButton
            icon={EditIcon}
            size="xl"
            tooltipContent={<>Edit details</>}
          />
          <IconButton
            icon={EllipsisIcon}
            size="xl"
            tooltipContent={
              <>
                More options for <strong>{title}</strong>
              </>
            }
          />
        </div>
        <div className="flex items-center gap-6">
          <IconButton
            icon={SearchIcon}
            size="lg"
            tooltipContent={
              <>
                Search in <strong>{title}</strong>
              </>
            }
          />
          <IconButton
            icon={SortDescIcon}
            size="lg"
            tooltipContent={<>Sort by</>}
          />
          <IconButton icon={ListIcon} size="lg" tooltipContent={<>View as</>} />
        </div>
      </div>
    </section>
  );
};
