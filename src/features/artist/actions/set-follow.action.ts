"use server";

import { requireAuth } from "@/lib/auth";
import { setFollowService } from "../services/follow.service";
import { revalidateTag } from "next/cache";

export async function setFollowAction(input: {
  artistId: string;
  follow: boolean;
}) {
  const user = await requireAuth();
  const res = await setFollowService(input, user.id);
  if (!res.ok) return res;

  if ("artistId" in (input ?? {}) && input?.artistId) {
    revalidateTag(`artist:${input.artistId}:followers`);
    revalidateTag(`user:${user.id}:following`);
  }
  return res;
}
