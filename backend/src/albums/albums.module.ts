import { Module } from "@nestjs/common";
import { AlbumsService } from "./albums.service";
import { AlbumsController } from "./albums.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { MediaService } from "src/media/media.service";

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, PrismaService, MediaService],
})
export class AlbumsModule {}
