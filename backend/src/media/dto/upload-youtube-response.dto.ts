import { ApiProperty } from "@nestjs/swagger";

export class UploadYoutubeResponse {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  duration: number;

  constructor(partial: Partial<UploadYoutubeResponse>) {
    Object.assign(this, partial);
  }
}
