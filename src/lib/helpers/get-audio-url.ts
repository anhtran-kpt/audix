export const getAudioUrl = (publicId: string): string => {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}.mp3`;
};

export const cldThumbUrl = (publicId: string, size: number) => {
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_${size},h_${size},q_auto,f_webp/${publicId}`;
};
