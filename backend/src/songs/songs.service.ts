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

    const lastSong = await this.prisma.song.findFirst({
      where: { albumId: dto.albumId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = (lastSong?.order || 0) + 1;

    const { artists, credits, genreIds, ...rest } = dto;

    const newSong = await this.prisma.song.create({
      data: {
        ...rest,
        order: newOrder,
        slug,
        artists: {
          create: artists.map((item, index) => ({
            type: item.type,
            order: index,
            artistId: item.artistId,
          })),
        },
        credits: {
          create: credits.map((credit) => ({
            role: credit.role,
            artistId: credit.artistId || null,
            name: credit.artistId ? null : credit.name,
          })),
        },
        genres: {
          create: genreIds.map((id) => ({
            genreId: id,
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

    await this.updateAlbumStats(newSong.albumId);

    return newSong;
  }

  async reorderSongs(albumId: string, songIds: string[]) {
    return this.prisma.$transaction(
      songIds.map((id, index) =>
        this.prisma.song.update({
          where: { id, albumId },
          data: { order: index + 1 },
        })
      )
    );
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

  private async updateAlbumStats(albumId: string) {
    const stats = await this.prisma.song.aggregate({
      where: { albumId },
      _count: {
        id: true,
      },
      _sum: {
        duration: true,
      },
    });

    await this.prisma.album.update({
      where: { id: albumId },
      data: {
        songsCount: stats._count.id,
        totalDuration: stats._sum.duration || 0,
      },
    });
  }
}
