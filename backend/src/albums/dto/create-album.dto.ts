import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMinSize,
  IsArray,
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
  thumbnailId?: string | null;

  @IsString()
  @IsOptional()
  thumbnailColor?: string | null;

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

  @ApiProperty({
    description: "List of Genre IDs",
    example: ["123e4567-e89b-12d3-a456-426614174000"],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: "At least one genre is required" })
  @IsUUID("4", { each: true, message: "Invalid Genre ID format" })
  genreIds: string[];
}
