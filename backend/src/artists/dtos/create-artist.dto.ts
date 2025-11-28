import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsUUID,
} from "class-validator";

export class CreateArtistDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  bio?: string | null;

  @IsString()
  @IsOptional()
  avatarId?: string | null;

  @IsString()
  @IsOptional()
  avatarColor?: string | null;

  @IsString()
  @IsOptional()
  bannerId?: string | null;

  @IsString()
  @IsOptional()
  bannerColor?: string | null;

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
