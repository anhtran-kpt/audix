import { ActionsSection } from "@/components/sections/artist-detail/actions-section";
import { BannerSection } from "@/components/sections/artist-detail/banner-section";
import {
  ArtistPopularTracks,
  PopularTracksSection,
} from "@/components/sections/artist-detail/popular-tracks-section";
import prisma from "@/lib/prisma";

export default async function ArtistDetail({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  const artist = await prisma.artist.findUniqueOrThrow({
    where: {
      id: artistId,
    },
    include: {
      genres: {
        select: {
          genre: {
            select: {
              color: true,
              name: true,
            },
          },
        },
      },
    },
  });

  console.log(artist);

  return (
    <>
      <BannerSection
        imageId={artist.imageId}
        name={artist.name}
        monthlyListeners={artist.monthlyListeners}
        isVerified={artist.isVerified}
        genres={artist.genres}
      />
      <ActionsSection name={artist.name} />
      <PopularTracksSection />
    </>
  );
}
