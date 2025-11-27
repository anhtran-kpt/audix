import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { ArtistType, CreditRole } from "generated/prisma";

export class SongGenreDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  genreId: string;
}

export class SongArtistDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artistId: string;

  @ApiProperty({ enum: ArtistType })
  @IsEnum(ArtistType)
  type: ArtistType;
}

export class SongCreditDto {
  @ApiProperty({ enum: CreditRole })
  @IsEnum(CreditRole)
  role: CreditRole;

  @ApiProperty()
  @ValidateIf((o: SongCreditDto) => !o.name)
  @IsString()
  @IsNotEmpty()
  artistId?: string;

  @ApiProperty()
  @ValidateIf((o: SongCreditDto) => !o.artistId)
  @IsString()
  @IsNotEmpty()
  name?: string;
}

export class CreateSongDto {
  @ApiProperty({ description: "Song title" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Cloudinary Audio Public ID" })
  @IsString()
  @IsNotEmpty()
  audioId: string;

  @ApiProperty({ description: "Duration in seconds" })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: "Sort order" })
  @IsNumber()
  order: number;

  @ApiPropertyOptional({ description: "Song lyrics", nullable: true })
  @IsString()
  @IsOptional()
  lyrics?: string | null;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isExplicit?: boolean;

  @ApiProperty({ description: "Album ID" })
  @IsUUID()
  @IsNotEmpty()
  albumId: string;

  @ApiProperty({ type: () => SongArtistDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongArtistDto)
  artists: SongArtistDto[];

  @ApiProperty({ type: () => SongCreditDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongCreditDto)
  credits: SongCreditDto[];

  @ApiProperty({ type: () => SongGenreDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongGenreDto)
  genres: SongGenreDto[];
}
