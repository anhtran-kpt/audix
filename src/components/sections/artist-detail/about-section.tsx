"use client";

import { CldImage } from "next-cloudinary";
import SectionHeading from "@/components/ui/section-heading";
import { ArtistBase } from "@/contracts/artist";
import { FollowersBadge } from "@/components/features/follow-badge";

type AboutSectionProps = Pick<ArtistBase, "bio" | "name" | "bannerId" | "id">;

export const AboutSection = ({
  bio,
  id,
  name,
  bannerId,
}: AboutSectionProps) => {
  return (
    <section>
      <SectionHeading title="About" />
      <div className="rounded-lg flex items-center justify-between gap-12 px-12 py-8 relative overflow-hidden aspect-video group">
        <CldImage
          src={bannerId}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover hover:scale-105 transition-transform duration-500 brightness-65"
        />
        <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 xl:bottom-12 left-6 md:left-8 lg:left-10 xl:left-12 space-y-3 w-4/5">
          <div>
            <FollowersBadge artistId={id} />
          </div>
          <div className="text-[calc(15rem/16)] text-white line-clamp-2 md:line-clamp-3 lg:line-clamp-4 xl:line-clamp-5">
            {bio}
          </div>
        </div>
      </div>
    </section>
  );
};
