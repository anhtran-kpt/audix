import { Injectable } from "@nestjs/common";
import { CreateSongDto } from "./dto/create-song.dto";
import { UpdateSongDto } from "./dto/update-song.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SlugService } from "src/common/services/slug.service";

@Injectable()
export class SongsService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService
  ) {}

  async create(dto: CreateSongDto) {
    const slug = await this.slugService.generateUniqueSlug(dto.title, "song");

    return await this.prisma.song.create({
      data: {
        ...dto,
        slug,
        artists: {
          create: dto.artists.map((item, index) => ({
            type: item.type,
            order: index,
            artistId: item.artistId,
          })),
        },
        credits: {
          create: dto.credits.map((credit) => ({
            role: credit.role,
            artistId: credit.artistId || null,
            name: credit.artistId ? null : credit.name,
          })),
        },
        genres: {
          create: dto.genres.map((genre) => ({
            genreId: genre.genreId,
          })),
        },
      },
      include: {
        album: {
          include: { artist: true },
        },
        artists: {
          include: { artist: true },
          orderBy: { order: "asc" },
        },
        credits: {
          include: { artist: true },
        },
        genres: {
          include: { genre: true },
        },
      },
    });
  }

  findAll() {
    return `This action returns all songs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} song`;
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    return `This action updates a #${id} song`;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
