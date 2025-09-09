"use server";

import "server-only";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function pickCoverSources(imageIds: string[]): string[] {
  const unique = Array.from(new Set(imageIds.filter(Boolean)));
  if (unique.length === 0) return [];
  if (unique.length < 4) return [unique[0]];
  return unique.slice(0, 4);
}

function cldThumbUrl(publicId: string, size: number) {
  return cloudinary.url(publicId, {
    secure: true,
    type: "upload",
    transformation: [{ width: size, height: size, crop: "fill" }],
    fetch_format: "webp",
    quality: "auto",
  });
}

async function fetchAsBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} for ${url}`);
  }
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

export async function generatePlaylistCover(
  imageIds: string[],
  playlistId: string
): Promise<string | null> {
  const sources = pickCoverSources(imageIds);

  if (sources.length === 0) return null;

  if (sources.length < 4) return sources[0];

  const [a, b, c, d] = sources;

  const urls = [a, b, c, d].map((id) => cldThumbUrl(id, 200));
  const [bufA, bufB, bufC, bufD] = await Promise.all(urls.map(fetchAsBuffer));

  const canvas = sharp({
    create: {
      width: 400,
      height: 400,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  });

  const collage = await canvas
    .composite([
      { input: bufA, left: 0, top: 0 },
      { input: bufB, left: 200, top: 0 },
      { input: bufC, left: 0, top: 200 },
      { input: bufD, left: 200, top: 200 },
    ])
    .webp()
    .toBuffer();

  const uploaded = await new Promise<{ public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "/audix/playlists",
          public_id: playlistId,
          overwrite: true,
          resource_type: "image",
        },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Upload failed"));
          resolve(result as any);
        }
      );
      stream.end(collage);
    }
  );

  return uploaded.public_id;
}
