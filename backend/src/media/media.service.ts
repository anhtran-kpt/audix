import { Injectable } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class MediaService {
  constructor(private readonly cloudinary: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File, folder: string) {
    const result = await this.cloudinary.uploadImage(file, folder);

    return {
      publicId: result.public_id,
      url: result.secure_url,
      dominantColor: result.colors?.[0]?.[0] || null,
    };
  }

  async deleteImage(publicId: string) {
    return this.cloudinary.deleteImage(publicId);
  }
}
