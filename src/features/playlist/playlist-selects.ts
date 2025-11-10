import { Prisma } from "@/app/generated/prisma";
import { userItemSelect } from "@/features/user/user-selects";

export const playlistItemSelect = {
  id: true,
  title: true,
  imageId: true,
  user: {
    select: userItemSelect,
  },
} satisfies Prisma.PlaylistSelect;
