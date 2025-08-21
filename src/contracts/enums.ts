import { z } from "zod";
import {
  AlbumType,
  PlaybackContextType,
  ArtistRole,
  CreditRole,
  ChartType,
  SubscriptionType,
  SubscriptionStatus,
} from "@/app/generated/prisma";

export const AlbumTypeSchema = z.enum(AlbumType);
export const PlaybackContextTypeSchema = z.enum(PlaybackContextType);
export const ArtistRoleSchema = z.enum(ArtistRole);
export const CreditRoleSchema = z.enum(CreditRole);
export const ChartTypeSchema = z.enum(ChartType);
export const SubscriptionTypeSchema = z.enum(SubscriptionType);
export const SubscriptionStatusSchema = z.enum(SubscriptionStatus);
