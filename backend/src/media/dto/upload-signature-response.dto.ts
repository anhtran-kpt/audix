import { ApiProperty } from "@nestjs/swagger";

export class UploadSignatureResponse {
  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  folder: string;

  @ApiProperty()
  apiKey: string | undefined;

  @ApiProperty()
  cloudName: string | undefined;

  constructor(partial: Partial<UploadSignatureResponse>) {
    Object.assign(this, partial);
  }
}
