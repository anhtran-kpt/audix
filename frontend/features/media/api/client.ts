import apiClient from "@/lib/axios";
import { UploadImageResponse, UploadSignatureResponse } from "../media.type";

export const getUploadAudioSignature =
  async (): Promise<UploadSignatureResponse> =>
    await apiClient.get("/api/media/signature/audio");

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiClient.post("/media/image/upload?folder=artists", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

interface SignData {
  apiKey: string;
  timestamp: string;
  signature: string;
  cloudName: string;
  folder: string;
}

type UploadAudioResponse = {
  id: string;
  duration: number;
  url: string;
};

export const uploadAudio = async (
  file: File,
  signData: SignData,
  onProgress?: (percent: number) => void
): Promise<UploadAudioResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", signData.timestamp);
  formData.append("signature", signData.signature);
  formData.append("folder", signData.folder);
  formData.append("resource_type", "video");

  const res = await apiClient.post(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`,
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }
  );

  return {
    id: res.data.public_id,
    duration: res.data.duration,
    url: res.data.secure_url,
  };
};
