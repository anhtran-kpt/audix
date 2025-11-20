import { PickType } from "@nestjs/swagger";
import { ArtistEntity } from "../entities/artist.entity";

export class ArtistSlugResponse extends PickType(ArtistEntity, [
  "slug",
] as const) {
  constructor(partial: Partial<ArtistSlugResponse>) {
    super();
    Object.assign(this, partial);
  }
}
