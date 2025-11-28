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
  getUploadSignature(
    subFolder: string,
    publicId: string,
    fetchColors: boolean
  ) {
    const apiSecret = this.configService.get<string>("CLOUDINARY_API_SECRET")!;
    const apiKey = this.configService.get<string>("CLOUDINARY_API_KEY");
    const cloudName = this.configService.get<string>("CLOUDINARY_CLOUD_NAME");
    const rootFolder = this.configService.get<string>(
      "CLOUDINARY_ROOT_FOLDER"
    )!;

    const finalFolder = rootFolder ? `${rootFolder}/${subFolder}` : subFolder;

    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign = {
      timestamp,
      folder: finalFolder,
      public_id: publicId,
      colors: fetchColors,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return {
      timestamp,
      signature,
      folder: finalFolder,
      publicId,
      fetchColors,
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
