"use client";

import SectionHeading from "@/components/ui/section-heading";
import { FollowersBadge } from "@/components/features/follow-badge";
import { AppImage } from "@/components/shared/app-image";
import { useQuery } from "@tanstack/react-query";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";

export const AboutSection = ({ artistId }: { artistId: string }) => {
  const { data: artist, status } = useQuery({
    ...artistQueryOptions.about(artistId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading title="About" />
      <div className="relative group">
        <AppImage
          src={artist.bannerId}
          alt={artist.name}
          sizes="100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-400 brightness-65"
          containerClassName="rounded-lg relative overflow-hidden aspect-[4/3] sm:aspect-[2/1] w-full"
        />
        <div className="absolute bottom-responsive left-responsive space-y-3 w-4/5">
          <div>
            <FollowersBadge artistId={artistId} />
          </div>
          <div className="text-[calc(15rem/16)] text-white line-clamp-4 xl:line-clamp-5">
            {artist.bio}
          </div>
        </div>
      </div>
    </section>
  );
};
