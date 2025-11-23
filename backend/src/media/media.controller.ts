import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { UserRole } from "src/auth/enums/role.enum";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { MediaService } from "./media.service";
import { ApiCreatedResponse } from "@nestjs/swagger";
import { UploadImageResponse } from "./dto/upload-image-response.dto";

@Controller("media")
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("image/upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiCreatedResponse({ type: UploadImageResponse })
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query("folder") folder: string = "general"
  ) {
    const res = await this.mediaService.uploadImage(file, folder);
    return new UploadImageResponse(res);
  }
}
