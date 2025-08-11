export const extractCloudinaryId = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  return imageUrl.split("/").pop()?.split(".")[0] || null;
};
