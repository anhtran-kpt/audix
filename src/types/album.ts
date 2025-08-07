import { Album, Prisma } from "@/app/generated/prisma";

export type TAlbum = Album;
export type TFullAlbum = Prisma.AlbumGetPayload<{
  include: {
    songs: true;
    artist: {
      select: {
        id: true;
        name: true;
        imageId: true;
      };
    };
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
    tracks: {};
  };
}>;

export type TAlbumGridItem = Prisma.AlbumGetPayload<{
  select: {
    id: true;
    title: true;
    imageId: true;
    releaseDate: true;
  };
}>;
