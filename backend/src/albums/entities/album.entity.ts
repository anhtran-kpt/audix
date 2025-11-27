import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  Album,
  AlbumGenre,
  AlbumType,
  Genre,
  UserLikedAlbum,
} from "generated/prisma";
import { ArtistEntity } from "src/artists/entities/artist.entity";
import { GenreEntity } from "src/genres/entities/genre.entity";
import { SongEntity } from "src/songs/entities/song.entity";

export class AlbumEntity implements Album {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true })
  thumbnailId: string | null;

  @ApiProperty({ nullable: true })
  thumbnailColor: string | null;

  @ApiProperty({
    enum: AlbumType,
    enumName: "AlbumType",
    example: AlbumType.ALBUM,
  })
  type: AlbumType;

  @ApiProperty()
  releaseDate: Date;

  @ApiProperty()
  totalDuration: number;

  @ApiProperty()
  songsCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  artistId: string;

  @ApiProperty({ type: () => ArtistEntity, required: false })
  @Type(() => ArtistEntity)
  @Expose()
  artist?: ArtistEntity;

  @ApiProperty({ type: () => SongEntity, required: false })
  @Type(() => SongEntity)
  songs?: SongEntity[];

  @Exclude()
  likedBy: UserLikedAlbum[];

  @Exclude()
  genres?: (AlbumGenre & { genre: Genre })[];

  @ApiProperty({ type: () => [GenreEntity] })
  @Expose()
  get genreList(): GenreEntity[] {
    if (!this.genres || this.genres.length === 0) {
      return [];
    }

    return this.genres.map((ag) => new GenreEntity(ag.genre));
  }

  @ApiProperty({ required: false })
  likesCount?: number;

  @ApiProperty({ required: false })
  isLiked?: boolean;

  constructor(partial: Partial<AlbumEntity>) {
    Object.assign(this, partial);
  }
}
