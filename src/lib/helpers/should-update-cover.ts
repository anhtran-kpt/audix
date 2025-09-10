export function shouldUpdateCover(
  prevImageIds: string[],
  nextImageIds: string[]
): boolean {
  const prevSet = Array.from(new Set(prevImageIds.filter(Boolean))).slice(0, 4);
  const nextSet = Array.from(new Set(nextImageIds.filter(Boolean))).slice(0, 4);

  if (prevSet.length === 0 && nextSet.length > 0) return true;

  if (prevSet.length < 4 && nextSet.length >= 4) return true;

  if (prevSet.length >= 4 && nextSet.length < 4) return true;

  if (prevSet.join(",") !== nextSet.join(",")) return true;

  return false;
}
