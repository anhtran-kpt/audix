import { ApiProperty } from "@nestjs/swagger";
import { CreditRole } from "generated/prisma";
import { Exclude, Type } from "class-transformer";
import { ArtistEntity } from "src/artists/entities/artist.entity";

export class SongCreditEntity {
  @ApiProperty({ enum: CreditRole })
  role: CreditRole;

  @ApiProperty({ nullable: true })
  name: string | null;

  @ApiProperty({ type: () => ArtistEntity, nullable: true })
  @Type(() => ArtistEntity)
  artist: ArtistEntity | null;

  @Exclude()
  songId: string;

  @Exclude()
  artistId: string | null;

  constructor(partial: Partial<SongCreditEntity>) {
    Object.assign(this, partial);
  }
}
