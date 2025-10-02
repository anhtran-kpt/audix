import { Prisma } from "@/app/generated/prisma";
import { userItemSelect } from "@/features/user/data-access/user-select";

export const playlistItemSelect = {
  id: true,
  title: true,
  imageId: true,
  user: {
    select: userItemSelect,
  },
} satisfies Prisma.PlaylistSelect;
