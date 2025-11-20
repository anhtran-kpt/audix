import { ApiProperty } from "@nestjs/swagger";
import { Song as PrismaSong } from "generated/prisma";

export class SongEntity implements PrismaSong {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  audioId: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  songNumber: number;

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

  constructor(partial: Partial<SongEntity>) {
    Object.assign(this, partial);
  }
}
