import SectionHeading from "@/components/ui/section-heading";
import { FollowersBadge } from "@/components/features/follow-badge";
import { ArtistDetailPage } from "@/features/artist/data-access/artist-repo";
import { AppImage } from "@/components/shared/app-image";

type AboutSectionProps = {
  bio: ArtistDetailPage["artist"]["bio"];
  artistId: string;
  name: ArtistDetailPage["artist"]["name"];
  bannerId: ArtistDetailPage["artist"]["bannerId"];
};

export const AboutSection = ({
  bio,
  artistId,
  name,
  bannerId,
}: AboutSectionProps) => {
  return (
    <section>
      <SectionHeading title="About" />
      <div className="relative group">
        <AppImage
          src={bannerId}
          alt={name}
          sizes="100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-400 brightness-65"
          containerClassName="rounded-lg relative overflow-hidden aspect-[2/1] w-full"
          quality={100}
        />
        <div className="absolute bottom-6 md:bottom-8 lg:bottom-10 xl:bottom-12 left-6 md:left-8 lg:left-10 xl:left-12 space-y-3 w-4/5">
          <div>
            <FollowersBadge artistId={artistId} />
          </div>
          <div className="text-15 text-white line-clamp-2 md:line-clamp-3 lg:line-clamp-4 xl:line-clamp-5">
            {bio}
          </div>
        </div>
      </div>
    </section>
  );
};
