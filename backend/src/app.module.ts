import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ArtistsModule } from "./artists/artists.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { CommonModule } from "./common/common.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { AlbumsModule } from "./albums/albums.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    CommonModule,
    ArtistsModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    CloudinaryModule,
    AlbumsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
