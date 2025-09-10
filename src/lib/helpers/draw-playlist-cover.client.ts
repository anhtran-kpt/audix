import { cldThumbUrl } from "./get-audio-url";

export async function drawPlaylistCoverClient(
  publicIds: string[]
): Promise<string | null> {
  const sources = Array.from(new Set(publicIds.filter(Boolean))).slice(0, 4);

  if (sources.length === 0) return null;
  if (sources.length === 1) return sources[0];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = 800;
  canvas.height = 800;

  const positions = [
    { x: 0, y: 0 },
    { x: 400, y: 0 },
    { x: 0, y: 400 },
    { x: 400, y: 400 },
  ];

  await Promise.all(
    sources.map(
      (id, i) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(img, positions[i].x, positions[i].y, 400, 400);
            resolve();
          };
          img.onerror = reject;
          img.src = cldThumbUrl(id, 800);
        })
    )
  );

  return canvas.toDataURL("image/webp");
}
