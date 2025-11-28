import { ApiProperty } from "@nestjs/swagger";

export class UploadSignatureResponse {
  @ApiProperty()
  publicId: string;

  @ApiProperty()
  timestamp: number;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  folder: string;

  @ApiProperty()
  apiKey: string | undefined;

  @ApiProperty()
  cloudName: string | undefined;

  @ApiProperty()
  fetchColors: boolean;

  constructor(partial: Partial<UploadSignatureResponse>) {
    Object.assign(this, partial);
  }
}
