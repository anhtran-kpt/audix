import { ApiProperty } from "@nestjs/swagger";
import { ArtistGenre as PrismaArtistGenre } from "generated/prisma";
import { Exclude, Type } from "class-transformer";
import { GenreEntity } from "src/genres/entities/genre.entity";
import { ArtistEntity } from "./artist.entity";

export class ArtistGenreEntity implements PrismaArtistGenre {
  @Exclude()
  artistId: string;

  @Exclude()
  genreId: string;

  @ApiProperty({ type: () => GenreEntity, required: false })
  @Type(() => GenreEntity)
  genre?: GenreEntity;

  @ApiProperty({ type: () => ArtistEntity, required: false })
  @Type(() => ArtistEntity)
  artist?: ArtistEntity;

  constructor(partial: Partial<ArtistGenreEntity>) {
    Object.assign(this, partial);
  }
}
