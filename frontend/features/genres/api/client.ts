import { Genre } from "@/features/common/types/entity.type";
import {
  PageOptions,
  PaginatedResponse,
} from "@/features/common/types/pagination";
import apiClient from "@/lib/axios";
import { CreateGenreDto, UpdateGenreDto } from "../genres.type";

export const getGenres = async (
  params: PageOptions
): Promise<PaginatedResponse<Genre>> => {
  return apiClient.get("/genres", { params });
};

export const getGenre = async (identifier: string): Promise<Genre> => {
  return apiClient.get(`/genres/${identifier}`);
};

export const createGenre = async (data: CreateGenreDto) => {
  return apiClient.post("/genres", data);
};

export const updateGenre = async (id: string, data: UpdateGenreDto) => {
  return apiClient.patch(`/genres/${id}`, data);
};

export const deleteGenre = async (id: string) => {
  return apiClient.delete(`/genres/${id}`);
};
