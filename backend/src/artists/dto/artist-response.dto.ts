import { PickType } from "@nestjs/swagger";
import { ArtistEntity } from "../entities/artist.entity";

export class FullArtistResponse extends PickType(ArtistEntity, [
  "id",
  "name",
  "slug",
  "bio",
  "avatarId",
  "bannerId",
  "avatarColor",
  "bannerColor",
  "followersCount",
] as const) {}

export class ArtistSlugResponse extends PickType(ArtistEntity, [
  "slug",
] as const) {}
