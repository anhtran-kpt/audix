import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { AlbumType } from "generated/prisma";

export class CreateAlbumDto {
  @ApiProperty({ example: "Midnight Memories" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: "cloudinary_id_123" })
  @IsString()
  @IsOptional()
  thumbnailId?: string;

  @ApiProperty({ enum: AlbumType, default: AlbumType.SINGLE })
  @IsEnum(AlbumType)
  @IsOptional()
  type?: AlbumType;

  @ApiPropertyOptional({ example: "2023-10-27T00:00:00.000Z" })
  @IsISO8601()
  @IsOptional()
  releaseDate?: string;

  @ApiProperty({ description: "Artist ID" })
  @IsUUID()
  @IsNotEmpty()
  artistId: string;
}
