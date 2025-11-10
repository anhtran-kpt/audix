import z from "zod";

export const ToggleLikeAlbumInputSchema = z.object({
  albumId: z.cuid2(),
});

export const ToggleLikePlaylistInputSchema = z.object({
  playlistId: z.cuid2(),
});
