"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const createPlaylist = async (formData: FormData) => {
  const title = formData.get("title") as string;

  await prisma.playlist.create({
    data: {
      title,
    },
  });

  redirect("/playlists/{}");
};
