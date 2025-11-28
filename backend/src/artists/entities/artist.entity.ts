import { ApiProperty } from "@nestjs/swagger";
import { Artist as PrismaArtist } from "generated/prisma";
import { Expose, Type } from "class-transformer";
import { CloudinaryUtil } from "src/cloudinary/utils/cloudinary.util";
import { ArtistGenreEntity } from "./artist-genre.entity";
import { SongArtistEntity } from "src/songs/entities/song-artist.entity";
import { AlbumEntity } from "src/albums/entities/album.entity";

export class ArtistEntity implements PrismaArtist {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  avatarId: string | null;

  @ApiProperty()
  bannerId: string | null;

  @ApiProperty()
  avatarColor: string | null;

  @ApiProperty()
  bannerColor: string | null;

  @ApiProperty()
  bio: string | null;

  @ApiProperty()
  followersCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: String, nullable: true })
  get avatarUrl(): string | null {
    return CloudinaryUtil.getAvatarUrl(this.avatarId);
  }

  @Expose()
  @ApiProperty({ type: String, nullable: true })
  get bannerUrl(): string | null {
    return CloudinaryUtil.getBannerUrl(this.bannerId);
  }

  @ApiProperty({ type: () => [ArtistGenreEntity], required: false })
  @Type(() => ArtistGenreEntity)
  genres?: ArtistGenreEntity[];

  @ApiProperty({ type: () => [SongArtistEntity], required: false })
  @Type(() => SongArtistEntity)
  songs?: SongArtistEntity[];

  @ApiProperty({ type: () => [AlbumEntity], required: false })
  @Type(() => AlbumEntity)
  albums?: AlbumEntity[];

  constructor(partial: Partial<ArtistEntity>) {
    Object.assign(this, partial);
  }
}
