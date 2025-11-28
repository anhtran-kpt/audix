import {
  PageOptions,
  PaginatedResponse,
} from "@/features/common/types/pagination";
import apiClient from "@/lib/axios";
import {
  AlbumDetailsResponse,
  CreateAlbumDto,
  UpdateAlbumDto,
} from "../albums.type";
import { AlbumEntity } from "@/features/common/types/entity.type";

export const getAlbums = async (
  params: PageOptions
): Promise<PaginatedResponse<AlbumEntity>> => {
  return apiClient.get("/albums", { params });
};

export const getAlbum = async (identifier: string): Promise<AlbumEntity> => {
  return apiClient.get(`/albums/${identifier}`);
};

export const getAlbumDetails = async (
  identifier: string
): Promise<AlbumDetailsResponse> => {
  return apiClient.get(`/albums/${identifier}/details`);
};

export const createAlbum = async (
  data: CreateAlbumDto
): Promise<AlbumEntity> => {
  return apiClient.post("/albums", data);
};

export const updateAlbum = async (id: string, data: UpdateAlbumDto) => {
  return apiClient.patch(`/albums/${id}`, data);
};

export const deleteAlbum = async (id: string) => {
  return apiClient.delete(`/albums/${id}`);
};
