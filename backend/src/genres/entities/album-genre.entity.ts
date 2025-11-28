import { ApiProperty } from "@nestjs/swagger";
import { AlbumGenre as PrismaAlbumGenre } from "generated/prisma";
import { Exclude, Type } from "class-transformer";
import { GenreEntity } from "src/genres/entities/genre.entity";
import { AlbumEntity } from "src/albums/entities/album.entity";

export class AlbumGenreEntity implements PrismaAlbumGenre {
  @Exclude()
  albumId: string;

  @Exclude()
  genreId: string;

  @ApiProperty({ type: () => GenreEntity, required: false })
  @Type(() => GenreEntity)
  genre?: GenreEntity;

  @ApiProperty({ type: () => AlbumEntity, required: false })
  @Type(() => AlbumEntity)
  album?: AlbumEntity;

  constructor(partial: Partial<AlbumGenreEntity>) {
    Object.assign(this, partial);
  }
}
