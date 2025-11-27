import { ApiProperty } from "@nestjs/swagger";
import { Song as PrismaSong } from "generated/prisma";
import { Exclude, Expose, Type } from "class-transformer";
import { SongArtistEntity } from "./song-artist.entity";
import { SongCreditEntity } from "./song-credit.entity";
import { CloudinaryUtil } from "src/cloudinary/utils/cloudinary.util";
import { AlbumEntity } from "src/albums/entities/album.entity";
import { SongGenreEntity } from "./song-genre.entity";

export class SongEntity implements PrismaSong {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @Exclude()
  audioId: string;

  @ApiProperty()
  @Expose()
  get audioUrl(): string | null {
    return CloudinaryUtil.getAudioUrl(this.audioId);
  }

  @ApiProperty()
  duration: number;

  @ApiProperty()
  order: number;

  @ApiProperty({ nullable: true })
  lyrics: string | null;

  @ApiProperty()
  isExplicit: boolean;

  @ApiProperty()
  playCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  albumId: string;

  @ApiProperty({ type: () => AlbumEntity })
  @Type(() => AlbumEntity)
  album?: AlbumEntity;

  @ApiProperty({ type: () => [SongArtistEntity] })
  @Type(() => SongArtistEntity)
  artists?: SongArtistEntity[];

  @ApiProperty({ type: () => [SongCreditEntity] })
  @Type(() => SongCreditEntity)
  credits?: SongCreditEntity[];

  @ApiProperty({ type: () => [SongGenreEntity] })
  @Type(() => SongGenreEntity)
  genres?: SongGenreEntity[];

  constructor(partial: Partial<SongEntity>) {
    Object.assign(this, partial);
  }
}
