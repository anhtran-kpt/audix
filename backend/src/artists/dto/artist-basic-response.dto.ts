import { ArtistEntity } from "../entities/artist.entity";

export class ArtistBasicResponse extends ArtistEntity {
  constructor(partial: Partial<ArtistBasicResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
