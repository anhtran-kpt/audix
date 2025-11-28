import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { ArtistType } from "generated/prisma";
import { ArtistEntity } from "src/artists/entities/artist.entity";
import { SongEntity } from "./song.entity";

export class SongArtistEntity {
  @ApiProperty({ enum: ArtistType })
  type: ArtistType;

  @ApiProperty()
  order: number;

  @Exclude()
  songId: string;

  @Exclude()
  artistId: string;

  @Exclude()
  id: string;

  @ApiProperty({ type: () => ArtistEntity })
  @Type(() => ArtistEntity)
  artist?: ArtistEntity;

  @ApiProperty({ type: () => SongEntity })
  @Type(() => SongEntity)
  song?: SongEntity;

  constructor(partial: Partial<SongArtistEntity>) {
    Object.assign(this, partial);
  }
}
