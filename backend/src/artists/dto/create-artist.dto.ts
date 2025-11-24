import { IsString, IsOptional } from "class-validator";

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
}
