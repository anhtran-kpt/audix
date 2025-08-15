import { Prisma } from "@/app/generated/prisma";

export type TTrack = Prisma.TrackGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    audioId: true;
    duration: true;
    trackNumber: true;
    isExplicit: true;
    playCount: true;
    createdAt: true;
    album: {
      select: {
        artistId: true;
        id: true;
        imageId: true;
        title: true;
      };
    };
    artists: {
      select: {
        artistId: true;
        role: true;
        order: true;
        artist: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    credits: {
      select: {
        id: true;
        artistId: true;
        name: true;
        order: true;
        role: true;
        details: true;
        artist: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;
