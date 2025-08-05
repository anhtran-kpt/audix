import { Artist, Prisma } from "@/app/generated/prisma";

export type TArtist = Artist;
export type TFullArtist = Prisma.ArtistGetPayload<{
  include: {
    songs: true;
    albums: true;
  };
}>;
