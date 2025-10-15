import { useEffect, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import tinycolor from "tinycolor2";

type Gradient = { from: string; via?: string; to: string } | null;

export const useImageGradient = (imageUrl: string | null) => {
  const [gradient, setGradient] = useState<Gradient>(null);
  const [background, setBackground] = useState<string>("rgb(0,0,0)");

  useEffect(() => {
    const getBackgroundFromCSS = () => {
      const cssVar = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim();
      if (cssVar) setBackground(cssVar);
    };
    getBackgroundFromCSS();
    const observer = new MutationObserver(() => getBackgroundFromCSS());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!imageUrl) return;

    Vibrant.from(imageUrl)
      .getPalette()
      .then((palette) => {
        if (cancelled) return;

        const base = palette.Vibrant?.hex || palette.DarkVibrant?.hex;
        if (!base) return;

        const baseColor = tinycolor(base).toHsl();

        const from = tinycolor({
          ...baseColor,
          l: Math.min(baseColor.l - 0.2, 0.5),
        }).toHexString();
        const via = tinycolor({
          ...baseColor,
          l: Math.max(baseColor.l - 0.4, 0.2),
        }).toHexString();
        const to = background;

        setGradient({ from, via, to });
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [imageUrl, background]);

  return { gradient };
};
