"use client";

import { useQuery } from "@tanstack/react-query";
import { AppImage } from "../shared/app-image";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { FollowersBadge } from "./follow-badge";

export const BannerSection = ({ artistId }: { artistId: string }) => {
  const { data: artist, status } = useQuery({
    ...artistQueryOptions.banner(artistId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 -mt-19 sm:-mt-21 md:-mt-23 lg:-mt-25 xl:-mt-27">
      <div className="relative">
        <AppImage
          priority
          alt={artist.name}
          src={artist.bannerId}
          containerClassName="rounded-none w-full h-52 sm:h-60 md:h-68 lg:h-76 xl:h-84 2xl:h-92"
          className="rounded-none brightness-80 object-top object-cover"
          sizes="100vw"
        />
        <div className="absolute flex flex-col gap-2 md:gap-3 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-12 bottom-4 lg:bottom-6">
          <span className="font-bold text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl">
            {artist.name}
          </span>
          <FollowersBadge artistId={artistId} />
        </div>
      </div>
    </section>
  );
};
