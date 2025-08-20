import { followInput } from "../schemas/follow.schema";
import { followRepo } from "../repos/follow.repo";
import prisma from "@/lib/db";
import { zodToFieldErrors } from "@/features/_shared/schemas/error";

type FollowResult =
  | { ok: true; followed: boolean }
  | { ok: false; formError?: string; fieldErrors?: Record<string, string> };

export async function setFollowService(
  raw: unknown,
  userId: string
): Promise<FollowResult> {
  const parsed = followInput.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodToFieldErrors(parsed.error) };
  }
  const { artistId, follow } = parsed.data;

  const exists = await prisma.artist.findUnique({
    where: { id: artistId },
    select: { id: true },
  });

  if (!exists) return { ok: false, formError: "Artist not found" };

  if (follow) {
    await followRepo.follow(userId, artistId);
    return { ok: true, followed: true };
  } else {
    await followRepo.unfollow(userId, artistId);
    return { ok: true, followed: false };
  }
}
