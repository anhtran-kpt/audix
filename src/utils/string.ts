export const getAudioUrl = (publicId: string): string => {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}.mp3`;
};

export const buildPlaylistCoverUrl = (publicIds: string[]) => {
  if (!publicIds || publicIds.length !== 4) {
    throw new Error("");
  }

  const imageSize = 400;

  const escapePublicId = (id: string) => id.replace(/\//g, ":");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const rightX = imageSize;
  const bottomY = imageSize;

  const transformations = [
    `h_${imageSize},w_${imageSize}`,

    `h_${imageSize},l_${escapePublicId(publicIds[1])},w_${imageSize}`,
    `fl_layer_apply,g_north_west,x_${rightX}`,

    `h_${imageSize},l_${escapePublicId(publicIds[2])},w_${imageSize}`,
    `fl_layer_apply,g_north_west,y_${bottomY}`,

    `h_${imageSize},l_${escapePublicId(publicIds[3])},w_${imageSize}`,
    `fl_layer_apply,g_north_west,x_${rightX},y_${bottomY}`,

    `f_auto,q_auto,dpr_auto`,
  ].join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/v1/${publicIds[0]}`;
};

export const norm = (s: string) => s.trim().toLowerCase();
