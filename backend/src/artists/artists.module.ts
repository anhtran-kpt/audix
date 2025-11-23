import { Module } from "@nestjs/common";
import { ArtistsController } from "./artists.controller";
import { ArtistsService } from "./artists.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { MediaModule } from "src/media/media.module";

@Module({
  imports: [PrismaModule, MediaModule],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
