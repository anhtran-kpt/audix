import { UploadFileResponse } from "./upload-file-response.dto";

export class UploadImageResponse extends UploadFileResponse {
  dominantColor: string | null;

  constructor(partial: Partial<UploadImageResponse>) {
    super(partial);
    Object.assign(this, partial);
  }
}
