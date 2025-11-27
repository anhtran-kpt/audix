import apiClient from "@/lib/axios";
import { CreateSongDto } from "../songs.type";

export const createSong = async (data: CreateSongDto) => {
  return apiClient.post("/songs", data);
};
