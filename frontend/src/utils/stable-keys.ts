export function stableKey<T extends Record<string, any>>(params?: T) {
  if (!params) return undefined;
  const sortedEntries = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));

  return Object.fromEntries(sortedEntries);
}
