import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { Album, AlbumType, UserLikedAlbum } from "generated/prisma";
import { ArtistEntity } from "src/artists/entities/artist.entity";
import { CloudinaryUtil } from "src/cloudinary/utils/cloudinary.util";
import { AlbumGenreEntity } from "src/genres/entities/album-genre.entity";
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

  @ApiProperty({ type: () => [SongEntity], required: false })
  @Type(() => SongEntity)
  songs?: SongEntity[];

  @ApiProperty({ type: () => [AlbumGenreEntity], required: false })
  @Type(() => AlbumGenreEntity)
  genres?: AlbumGenreEntity[];

  @Exclude()
  likedBy: UserLikedAlbum[];

  @Expose()
  @ApiProperty({ type: String, nullable: true })
  get thumbnailUrl(): string | null {
    return CloudinaryUtil.getThumbnailUrl(this.thumbnailId);
  }

  constructor(partial: Partial<AlbumEntity>) {
    Object.assign(this, partial);
  }
}
