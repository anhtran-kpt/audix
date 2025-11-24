import apiClient from "@/lib/axios";
import { UploadImageResponse, UploadSignatureResponse } from "../media.type";
import axios from "axios";

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

export const uploadAudio = async (file: File) => {
  const signData = await getUploadAudioSignature();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.apiKey);
  formData.append("timestamp", signData.timestamp);
  formData.append("signature", signData.signature);
  formData.append("folder", "songs");

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`,
    formData
  );

  return {
    id: res.data.public_id,
    duration: res.data.duration,
  };
};
