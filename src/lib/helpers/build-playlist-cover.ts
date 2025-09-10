"use server";

import "server-only";
import { drawPlaylistCoverServer } from "./draw-playlist-cover.server";
import db from "../db";
import cloudinary from "../config/cloudinary";

export async function generatePlaylistCover(
  imageUrls: string[],
  playlistId: string
) {
  const buffer = await drawPlaylistCoverServer(imageUrls);
  if (!buffer) return null;

  cloudinary.uploader
    .upload_stream(
      {
        public_id: playlistId,
        folder: "/audix/playlists",
        overwrite: true,
        format: "webp",
        resource_type: "image",
      },
      async (err, result) => {
        if (err) {
          console.error("Cloudinary upload failed", err);
        } else if (result?.public_id) {
          await db.playlist.update({
            where: { id: playlistId },
            data: { imageId: result.public_id },
          });
        }
      }
    )
    .end(buffer);
}
