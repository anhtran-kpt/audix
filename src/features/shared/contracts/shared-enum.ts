import { z } from "zod";
import {
  AlbumType,
  PlaybackContextType as PlaybackContextTypeEnum,
  ArtistRole,
  CreditRole,
  ChartType,
  SubscriptionType,
  SubscriptionStatus,
  RepeatMode as RepeatModeEnum,
  QueueItemKind as QueueItemKindEnum,
} from "@/app/generated/prisma";

export const AlbumTypeSchema = z.enum(AlbumType);
export const PlaybackContextTypeSchema = z.enum(PlaybackContextTypeEnum);
export const ArtistRoleSchema = z.enum(ArtistRole);
export const CreditRoleSchema = z.enum(CreditRole);
export const ChartTypeSchema = z.enum(ChartType);
export const SubscriptionTypeSchema = z.enum(SubscriptionType);
export const SubscriptionStatusSchema = z.enum(SubscriptionStatus);
export const RepeatModeSchema = z.enum(RepeatModeEnum);
export const QueueItemKindSchema = z.enum(QueueItemKindEnum);

export type PlaybackContextType = z.infer<typeof PlaybackContextTypeSchema>;
export type RepeatMode = z.infer<typeof RepeatModeSchema>;
export type QueueItemKind = z.infer<typeof QueueItemKindSchema>;
