import { Artist } from "@/features/common/types/entity.type";
import { PaginatedResponse } from "@/features/common/types/paginated-response";
import apiClient from "@/lib/axios";

export const getArtists = async (params: { page: number; limit: number }) => {
  return apiClient.get<PaginatedResponse<Artist>>("/artists", { params });
};
