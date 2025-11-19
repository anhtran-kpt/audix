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

  @ApiProperty({ nullable: true })
  avatarId: string | null;

  @ApiProperty({ nullable: true })
  bannerId: string | null;

  @ApiProperty({ nullable: true })
  avatarColor: string | null;

  @ApiProperty({ nullable: true })
  bannerColor: string | null;

  @ApiProperty({ nullable: true })
  bio: string | null;

  @ApiProperty()
  followersCount: number;

  @ApiProperty({ type: () => [SongEntity], required: false })
  songs?: SongEntity[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
