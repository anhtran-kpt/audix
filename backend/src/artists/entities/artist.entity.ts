import { ApiProperty } from "@nestjs/swagger";
import { SongEntity } from "src/songs/entities/song.entity";
import { Artist as PrismaArtist } from "generated/prisma";

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

  @ApiProperty({ type: () => [SongEntity], required: false })
  songs?: SongEntity[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<ArtistEntity>) {
    Object.assign(this, partial);
  }
}
