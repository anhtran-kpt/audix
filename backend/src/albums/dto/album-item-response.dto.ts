import { PickType } from "@nestjs/swagger";
import { AlbumEntity } from "../entities/album.entity";

export class AlbumItemResponse extends PickType(AlbumEntity, [
  "id",
  "slug",
  "thumbnailId",
  "artist",
  "releaseDate",
]) {
  constructor(partial: Partial<AlbumItemResponse>) {
    super();
    Object.assign(this, partial);
  }
}
