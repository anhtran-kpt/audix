import { ApiProperty } from "@nestjs/swagger";

export class UploadFileResponse {
  @ApiProperty()
  publicId: string;

  constructor(partial: Partial<UploadFileResponse>) {
    Object.assign(this, partial);
  }
}
