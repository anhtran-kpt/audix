import { PickType } from "@nestjs/swagger";
import { ArtistEntity } from "../entities/artist.entity";

export class FullArtist extends PickType(ArtistEntity, [
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

export class ArtistSlug extends PickType(ArtistEntity, ["slug"] as const) {}
