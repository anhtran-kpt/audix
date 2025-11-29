import apiClient from "@/lib/axios";
import { CreateSongDto, UpdateSongDto } from "../songs.type";
import { SongEntity } from "@/features/common/types/entity.type";

export const createSong = async (data: CreateSongDto): Promise<SongEntity> => {
  return apiClient.post("/songs", data);
};

export const updateSong = async (id: string, data: UpdateSongDto) => {
  return apiClient.put(`/songs/${id}`, data);
};

export const deleteSong = async (id: string) => {
  return apiClient.delete(`/songs/${id}`);
};

export const reorderSongs = async (albumId: string, songIds: string[]) => {
  return apiClient.put(`/albums/${albumId}/reorder`, { songIds });
};
