import apiClient from "@/lib/axios";
import { UploadImageResponse } from "../media.type";

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiClient.post("/media/image/upload?folder=artists", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
