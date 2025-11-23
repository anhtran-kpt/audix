export class CloudinaryUtil {
  private static readonly CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  private static readonly BASE_URL = `https://res.cloudinary.com/${this.CLOUD_NAME}/image/upload/`;

  static getFullUrl(publicId: string | null): string | null {
    if (!publicId) return null;

    if (publicId.startsWith("http")) return publicId;

    return `${this.BASE_URL}q_auto,f_auto/${publicId}`;
  }
}
