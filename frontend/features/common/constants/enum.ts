import { components } from "../types/api-schema";

export type UserRoleType = components["schemas"]["UserRole"];
export const UserRole: Record<UserRoleType, UserRoleType> = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const USER_ROLE_OPTIONS = Object.values(UserRole).map((role) => ({
  label: role,
  value: role,
}));

export type AlbumType = components["schemas"]["AlbumType"];
export const AlbumType: Record<AlbumType, AlbumType> = {
  ALBUM: "ALBUM",
  EP: "EP",
  SINGLE: "SINGLE",
};

export const ALBUM_TYPE_OPTIONS = Object.values(AlbumType).map((role) => ({
  label: role,
  value: role,
}));
