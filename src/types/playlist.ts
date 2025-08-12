import { Playlist, Prisma } from "@/app/generated/prisma";

export type TPlaylist = Playlist;
export type TFullPlaylist = Prisma.PlaylistGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
  };
}>;

export type TPlaylistGridItem = Prisma.PlaylistGetPayload<{
  select: {
    id: true;
    title: true;
    imageId: true;
    releaseDate: true;
  };
}>;
