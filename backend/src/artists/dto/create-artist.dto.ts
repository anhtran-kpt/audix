import { IsString, IsNotEmpty, ValidateIf } from "class-validator";

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  bio: string | null;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  avatarId: string | null;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  avatarColor: string | null;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  bannerId: string | null;

  @IsString()
  @ValidateIf((_, value) => value !== null)
  bannerColor: string | null;
}
