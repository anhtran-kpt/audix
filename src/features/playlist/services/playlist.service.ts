import { playlistCreateInput } from "../schemas/playlist.schema";
import { zodToFieldErrors } from "@/features/_shared/schemas/error";
import { playlistRepo } from "../repos/playlist.repo";

export type CreatePlaylistResult =
  | { ok: true; playlistId: string }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

export async function createPlaylistService(
  raw: unknown,
  userId: string
): Promise<CreatePlaylistResult> {
  const parsed = playlistCreateInput.safeParse(raw);

  if (!parsed.success)
    return { ok: false, fieldErrors: zodToFieldErrors(parsed.error) };

  const data = parsed.data;

  const created = await playlistRepo.create(userId, data);

  return { ok: true, playlistId: created.id };
}
