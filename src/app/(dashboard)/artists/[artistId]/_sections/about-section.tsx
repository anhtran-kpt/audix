import SectionHeading from "@/components/ui/section-heading";
import { AppImage } from "@/components/shared/app-image";
import { ArtistOverview } from "@/lib/data/artist-data";
import { ArtistFollowersBadge } from "@/components/features/artist-follow-badge";

type AboutSectionProps = {
  artist: Omit<ArtistOverview, "tracks" | "imageId">;
};
export const AboutSection = ({ artist }: AboutSectionProps) => {
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
            <ArtistFollowersBadge
              artistId={artist.id}
              initialData={artist.followersCount}
            />
          </div>
          <div className="text-[calc(15rem/16)] text-white line-clamp-4 xl:line-clamp-5">
            {artist.bio}
          </div>
        </div>
      </div>
    </section>
  );
};
