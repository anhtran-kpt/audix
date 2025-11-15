import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsModule } from './artists/artists.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ArtistsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
