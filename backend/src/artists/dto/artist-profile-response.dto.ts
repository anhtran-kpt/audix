import { ApiProperty, PickType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArtistEntity } from "../entities/artist.entity";
import { SongEntity } from "src/songs/entities/song.entity";
import { AlbumEntity } from "src/albums/entities/album.entity";

class AlbumArtistDto extends PickType(ArtistEntity, ["id", "name"] as const) {
  constructor(partial: Partial<AlbumArtistDto>) {
    super();
    Object.assign(this, partial);
  }
}

class InfoDto extends PickType(ArtistEntity, [
  "id",
  "name",
  "slug",
  "avatarId",
  "bannerId",
  "avatarColor",
  "bannerColor",
  "bio",
  "followersCount",
] as const) {
  constructor(partial: Partial<InfoDto>) {
    super();
    Object.assign(this, partial);
  }
}

class DiscographyAlbumDto extends PickType(AlbumEntity, [
  "id",
  "title",
  "thumbnailId",
  "type",
  "releaseDate",
] as const) {
  @ApiProperty({ type: AlbumArtistDto })
  @Type(() => AlbumArtistDto)
  artist: AlbumArtistDto;

  constructor(partial: Partial<DiscographyAlbumDto>) {
    super();
    Object.assign(this, partial);
  }
}

class PopularSongDto extends PickType(SongEntity, [
  "id",
  "title",
  "audioId",
  "duration",
  "songNumber",
  "isExplicit",
  "playCount",
] as const) {
  constructor(partial: Partial<PopularSongDto>) {
    super();
    Object.assign(this, partial);
  }
}

class DiscographyDto {
  @ApiProperty({ type: [DiscographyAlbumDto] })
  @Type(() => DiscographyAlbumDto)
  albums: DiscographyAlbumDto[];

  @ApiProperty({ type: [DiscographyAlbumDto] })
  @Type(() => DiscographyAlbumDto)
  singlesAndEps: DiscographyAlbumDto[];
}

export class ArtistProfileResponse {
  @ApiProperty({ type: InfoDto })
  @Type(() => InfoDto)
  info: InfoDto;

  @ApiProperty({ type: [PopularSongDto] })
  @Type(() => PopularSongDto)
  popularSongs: PopularSongDto[];

  @ApiProperty({ type: DiscographyDto })
  @Type(() => DiscographyDto)
  discography: DiscographyDto;

  constructor(partial: Partial<ArtistProfileResponse>) {
    Object.assign(this, partial);
  }
}
