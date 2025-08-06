import { Artist, Prisma } from "@/app/generated/prisma";

export type TArtist = Artist;
export type TFullArtist = Prisma.ArtistGetPayload<{
  include: {
    songs: true;
    albums: true;
    genres: {
      select: {
        genre: {
          select: {
            name: true;
            color: true;
          };
        };
      };
    };
  };
}>;

export type TArtistGridItem = Prisma.ArtistGetPayload<{
  select: {
    id: true;
    name: true;
    imageId: true;
  };
}>;
