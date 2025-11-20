import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import {
  Album,
  AlbumGenre,
  Artist,
  ArtistGenre,
  Genre,
  Song,
  SongGenre,
} from "generated/prisma";
import { AlbumEntity } from "src/albums/entities/album.entity";
import { ArtistEntity } from "src/artists/entities/artist.entity";
import { SongEntity } from "src/songs/entities/song.entity";

export class GenreEntity implements Genre {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @Exclude()
  songs?: (SongGenre & { song: Song })[];

  @ApiProperty({ type: () => [SongEntity] })
  @Expose()
  get songList(): SongEntity[] {
    if (!this.songs || this.songs.length === 0) {
      return [];
    }

    return this.songs.map((gs) => new SongEntity(gs.song));
  }

  @Exclude()
  albums?: (AlbumGenre & { album: Album })[];

  @ApiProperty({ type: () => [AlbumEntity] })
  @Expose()
  get albumList(): AlbumEntity[] {
    if (!this.albums || this.albums.length === 0) {
      return [];
    }

    return this.albums.map((gs) => new AlbumEntity(gs.album));
  }

  @Exclude()
  artists?: (ArtistGenre & { artist: Artist })[];

  @ApiProperty({ type: () => [ArtistEntity] })
  @Expose()
  get artistList(): ArtistEntity[] {
    if (!this.artists || this.artists.length === 0) {
      return [];
    }

    return this.artists.map((gs) => new ArtistEntity(gs.artist));
  }

  constructor(partial: Partial<GenreEntity>) {
    Object.assign(this, partial);
  }
}
