import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { Album, AlbumType } from "generated/prisma";
import { ArtistEntity } from "src/artists/entities/artist.entity";

export class AlbumEntity implements Album {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true })
  thumbnailId: string | null;

  @ApiProperty({ enum: AlbumType })
  type: AlbumType;

  @ApiProperty()
  releaseDate: Date;

  @ApiProperty()
  totalSongs: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  artistId: string;

  @ApiProperty({ type: () => ArtistEntity, required: false })
  @Type(() => ArtistEntity) // Để Interceptor biết cách serialize Artist bên trong
  artist?: ArtistEntity;

  constructor(partial: Partial<AlbumEntity>) {
    Object.assign(this, partial);
  }
}
