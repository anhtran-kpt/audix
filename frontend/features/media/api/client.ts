import apiClient from "@/lib/axios";
import { UploadImageResponse, UploadSignatureResponse } from "../media.type";
import axios from "axios";
import { toSlug } from "@/features/common/utils/to-slug";

export interface UploadResponse {
  publicId: string;
  duration?: number;
  dominantColor?: string;
}

export const getUploadSignature = async (
  folder: string,
  resourceType: "image" | "video",
  originalName: string,
  contextStr: string
): Promise<UploadSignatureResponse> => {
  const mainSlug = toSlug(originalName);
  const ctxSlug = toSlug(contextStr);

  const prefix = `${ctxSlug}_${mainSlug}`;

  const randomSuffix = Math.floor(Math.random() * 1000);
  const filename = `${prefix}_${randomSuffix}`;

  return await apiClient.get("/media/signature", {
    params: { folder, filename, resourceType },
  });
};

export const uploadMedia = async (
  file: File,
  resourceType: "image" | "video",
  folder: "artists" | "albums" | "songs",
  customName: { main: string; ctx: string },
  onProgress?: (percent: number) => void
): Promise<UploadResponse> => {
  const signData = await getUploadSignature(
    folder,
    resourceType,
    customName.main,
    customName.ctx
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", signData.timestamp.toString());
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);
  formData.append("public_id", signData.publicId);

  if (signData.fetchColors) {
    formData.append("colors", "true");
  }

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`,
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    }
  );

  let dominantColor = undefined;
  if (res.data.colors && res.data.colors.length > 0) {
    dominantColor = res.data.colors[0][0];
  }

  return {
    publicId: res.data.public_id,
    duration: res.data.duration,
    dominantColor,
  };
};
