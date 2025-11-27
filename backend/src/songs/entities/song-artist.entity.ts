import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { ArtistType } from "generated/prisma";
import { ArtistEntity } from "src/artists/entities/artist.entity";

export class SongArtistEntity {
  @ApiProperty({ enum: ArtistType })
  type: ArtistType;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: () => ArtistEntity })
  @Type(() => ArtistEntity)
  artist: ArtistEntity;

  @Exclude()
  songId: string;

  @Exclude()
  artistId: string;

  @Exclude()
  id: string;

  constructor(partial: Partial<SongArtistEntity>) {
    Object.assign(this, partial);
  }
}
