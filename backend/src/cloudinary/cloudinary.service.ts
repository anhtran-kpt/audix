import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  v2 as cloudinary,
  UploadApiResponse,
  DeleteApiResponse,
} from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}
  getUploadSignature(folder: string) {
    const apiSecret = this.configService.get<string>("CLOUDINARY_API_SECRET")!;
    const apiKey = this.configService.get<string>("CLOUDINARY_API_KEY");
    const cloudName = this.configService.get<string>("CLOUDINARY_CLOUD_NAME");

    const now = new Date();
    const timestamp = now.toISOString();

    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return {
      timestamp,
      signature,
      folder,
      apiKey,
      cloudName,
    };
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: folder, colors: true },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          resolve(result as UploadApiResponse);
        }
      );
      upload.end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<DeleteApiResponse> {
    return new Promise<DeleteApiResponse>((resolve, reject) => {
      void cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(new Error((error as Error).message));
        resolve(result as DeleteApiResponse);
      });
    });
  }
}
