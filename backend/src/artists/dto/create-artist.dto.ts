import { IsString, IsNotEmpty } from "class-validator";

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
