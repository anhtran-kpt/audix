import { Artist } from "@/features/common/types/entity.type";
import {
  PageParams,
  PaginatedResponse,
} from "@/features/common/types/pagination";
import apiClient from "@/lib/axios";
import {
  ArtistProfileResponse,
  CreateArtistDto,
  UpdateArtistDto,
} from "../artists.type";

export const getArtists = async (
  params: PageParams
): Promise<PaginatedResponse<Artist>> => {
  return apiClient.get("/artists", { params });
};

export const getArtistBasic = async (id: string): Promise<Artist> => {
  return apiClient.get(`/artists/${id}`);
};

export const getArtistProfile = async (
  identifier: string
): Promise<ArtistProfileResponse> => {
  return apiClient.get(`/artists/profile/${identifier}`);
};

export const createArtist = async (data: CreateArtistDto) => {
  return apiClient.post("/artists", data);
};

export const updateArtist = async (id: string, data: UpdateArtistDto) => {
  return apiClient.patch(`/artists/${id}`, data);
};
