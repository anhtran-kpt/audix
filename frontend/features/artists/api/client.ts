import { Artist } from "@/features/common/types/entity.type";
import {
  PageOptions,
  PaginatedResponse,
} from "@/features/common/types/pagination";
import apiClient from "@/lib/axios";
import {
  ArtistDetailsResponse,
  CreateArtistDto,
  UpdateArtistDto,
} from "../artists.type";

export const getArtists = async (
  params: PageOptions
): Promise<PaginatedResponse<Artist>> => {
  return apiClient.get("/artists", { params });
};

export const getArtist = async (identifier: string): Promise<Artist> => {
  return apiClient.get(`/artists/${identifier}`);
};

export const getArtistDetails = async (
  identifier: string
): Promise<ArtistDetailsResponse> => {
  return apiClient.get(`/artists/${identifier}/details`);
};

export const createArtist = async (data: CreateArtistDto) => {
  return apiClient.post("/artists", data);
};

export const updateArtist = async (id: string, data: UpdateArtistDto) => {
  return apiClient.patch(`/artists/${id}`, data);
};

export const deleteArtist = async (id: string) => {
  return apiClient.delete(`/artists/${id}`);
};
