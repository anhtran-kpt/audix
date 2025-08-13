import { useEffect, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import tinycolor from "tinycolor2";

type Gradient = { from: string; via?: string; to: string } | null;

export const useImageGradient = (imageUrl: string | null) => {
  const [gradient, setGradient] = useState<Gradient>(null);

  useEffect(() => {
    let cancelled = false;
    if (!imageUrl) return;

    Vibrant.from(imageUrl)
      .getPalette()
      .then((palette) => {
        if (cancelled) return;
        const base = palette.DarkVibrant?.hex || palette.Vibrant?.hex;
        if (!base) return;

        const from = base;
        const via = tinycolor(base).lighten(20).desaturate(10).toHexString();
        const to = tinycolor(base).lighten(40).desaturate(10).toHexString();
        setGradient({ from, via, to });
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return { gradient };
};
