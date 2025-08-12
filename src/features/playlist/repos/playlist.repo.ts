import prisma from "@/lib/prisma";

export const playlistRepo = {
  create(
    userId: string,
    data: {
      title: string;
      description?: string;
      isPublic: boolean;
    }
  ) {
    return prisma.playlist.create({
      data: { userId, ...data },
      select: { id: true },
    });
  },
};
