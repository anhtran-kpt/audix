import { useEffect, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import tinycolor from "tinycolor2";

export const useDominantColor = (imageUrl: string | null) => {
  const [color, setColor] = useState<string>("rgb(0,0,0)");

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;

    Vibrant.from(imageUrl)
      .getPalette()
      .then((palette) => {
        if (cancelled) return;

        const base =
          palette.Vibrant?.hex ||
          palette.DarkVibrant?.hex ||
          palette.Muted?.hex;

        if (!base) return;

        const main = tinycolor(base);
        const adjusted = main.isLight() ? main.darken(20) : main.brighten(10);

        setColor(adjusted.toHexString());
      })
      .catch(() => setColor("rgb(0,0,0)"));

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return color;
};
