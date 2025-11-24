import { ImageTransformOptions } from "../types/image-transform-options.type";

export class CloudinaryUtil {
  private static readonly CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  private static readonly BASE_URL = `https://res.cloudinary.com/${this.CLOUD_NAME}/image/upload/`;

  static getFullUrl(publicId: string | null): string | null {
    if (!publicId) return null;

    if (publicId.startsWith("http")) return publicId;

    return `${this.BASE_URL}q_auto,f_auto/${publicId}`;
  }

  static generateUrl(
    publicId: string | null,
    options?: ImageTransformOptions
  ): string | null {
    if (!publicId) return null;

    if (publicId.startsWith("http") || publicId.startsWith("https")) {
      return publicId;
    }

    const transformParams: string[] = [];

    transformParams.push(options?.quality ? `q_${options.quality}` : "q_auto");
    transformParams.push(options?.format ? `f_${options.format}` : "f_auto");

    if (options?.crop) transformParams.push(`c_${options.crop}`);
    if (options?.width) transformParams.push(`w_${options.width}`);
    if (options?.height) transformParams.push(`h_${options.height}`);

    if (options?.gravity) transformParams.push(`g_${options.gravity}`);

    const transformString = transformParams.join(",");

    return `${this.BASE_URL}${transformString}/${publicId}`;
  }

  static getAvatarUrl(publicId: string | null, size = 500): string | null {
    return this.generateUrl(publicId, {
      width: size,
      height: size,
      crop: "fill",
      gravity: "face",
    });
  }

  static getBannerUrl(publicId: string | null): string | null {
    return this.generateUrl(publicId, {
      width: 1920,
      height: 1080,
      crop: "fill",
      gravity: "auto",
    });
  }

  static getThumbnailUrl(publicId: string | null, size = 150): string | null {
    return this.generateUrl(publicId, {
      width: size,
      height: size,
      crop: "fill",
      quality: "auto:low",
    });
  }
}
