"use server";

import "server-only";
import sharp from "sharp";
import { cldThumbUrl } from "./get-audio-url";

export async function drawPlaylistCoverServer(
  imageUrls: string[]
): Promise<Buffer | null> {
  const sources = Array.from(new Set(imageUrls.filter(Boolean))).slice(0, 4);

  if (sources.length === 0) return null;
  if (sources.length === 1) {
    const url = cldThumbUrl(sources[0], 400);
    const res = await fetch(url);
    return Buffer.from(await res.arrayBuffer());
  }

  const buffers = await Promise.all(
    sources.map(async (src) => {
      const url = cldThumbUrl(src, 400);
      const res = await fetch(url);
      return Buffer.from(await res.arrayBuffer());
    })
  );

  const canvas = sharp({
    create: { width: 800, height: 800, channels: 3, background: "#000" },
  });

  const composites = buffers.map((buf, i) => {
    const x = i % 2 === 0 ? 0 : 400;
    const y = i < 2 ? 0 : 400;
    return { input: buf, top: y, left: x };
  });

  return canvas.composite(composites).png().toBuffer();
}
