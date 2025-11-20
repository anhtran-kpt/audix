import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { SlugService } from "src/common/services/slug.service";
import { Prisma } from "generated/prisma";
import { isUUID } from "class-validator";

@Injectable()
export class AlbumsService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService
  ) {}

  async create(dto: CreateAlbumDto) {
    const slug = await this.slugService.generateUniqueSlug(dto.title, "album");

    return this.prisma.album.create({
      data: {
        title: dto.title,
        slug: slug,
        thumbnailId: dto.thumbnailId,
        type: dto.type,
        releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
        artist: {
          connect: { id: dto.artistId },
        },
      },
      include: {
        artist: true,
      },
    });
  }

  async findAll() {
    return this.prisma.album.findMany({
      orderBy: { releaseDate: "desc" },
      include: {
        artist: {
          select: { id: true, name: true, avatarId: true },
        },
      },
    });
  }

  async findOne(identifier: string) {
    let where: Prisma.AlbumWhereUniqueInput;

    if (isUUID(identifier)) {
      where = { id: identifier };
    } else {
      where = { slug: identifier };
    }

    const album = await this.prisma.album.findUnique({
      where,
      include: {
        artist: true,
        songs: {
          orderBy: { songNumber: "asc" },
        },
      },
    });

    if (!album) throw new BadRequestException("Album not found");
    return album;
  }
}
