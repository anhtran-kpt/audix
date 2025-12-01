import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UploadYoutubeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  youtubeUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  songTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artistName: string;
}
