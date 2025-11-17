import { IsString, IsNotEmpty } from "class-validator";

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  bio: string;

  @IsString()
  @IsNotEmpty()
  imageId: string;

  @IsString()
  @IsNotEmpty()
  bannerId: string;
}
