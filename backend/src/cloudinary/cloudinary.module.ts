import { Module, Global } from "@nestjs/common";
import { CloudinaryProvider } from "./cloudinary.provider";
import { ConfigModule } from "@nestjs/config";
import { CloudinaryService } from "./cloudinary.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
