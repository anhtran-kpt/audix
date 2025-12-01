import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  v2 as cloudinary,
  UploadApiResponse,
  DeleteApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { youtubeDl } from "youtube-dl-exec";

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

  async uploadFromYoutube(
    youtubeUrl: string,
    folder: string,
    publicId: string
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          public_id: publicId,
          resource_type: "video",
          format: "mp3",
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error)
            return reject(
              new BadRequestException("Cloudinary upload failed", error.message)
            );
          if (!result)
            return reject(
              new InternalServerErrorException(
                "Cloudinary returned empty result"
              )
            );

          console.log(result);
          resolve(result);
        }
      );

      const subprocess = youtubeDl.exec(youtubeUrl, {
        output: "-",
        format: "bestaudio[ext=m4a][abr<=128]/bestaudio[ext=m4a]/bestaudio",
        noCheckCertificates: true,
        noWarnings: true,
        preferFreeFormats: true,
        addHeader: ["referer:youtube.com", "user-agent:googlebot"],
      });

      if (subprocess.stdout) {
        subprocess.stdout.pipe(uploadStream);
      } else {
        reject(
          new InternalServerErrorException("Failed to start YouTube stream")
        );
      }

      subprocess.stderr?.on("data", (data: Buffer) => {
        const log = data.toString();

        console.log(log);

        if (log.includes("ERROR")) console.error("YT-DLP Error:", log);
      });
    });
  }
}
