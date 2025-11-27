import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Type } from "class-transformer";
import { GenreEntity } from "src/genres/entities/genre.entity";

export class SongGenreEntity {
  @ApiProperty({ type: () => GenreEntity })
  @Type(() => GenreEntity)
  genre: GenreEntity;

  @Exclude()
  songId: string;

  @Exclude()
  genreId: string;

  @Exclude()
  id: string;

  constructor(partial: Partial<SongGenreEntity>) {
    Object.assign(this, partial);
  }
}
