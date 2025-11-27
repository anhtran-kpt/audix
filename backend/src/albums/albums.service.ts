import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { SlugService } from "src/common/services/slug.service";
import { Prisma } from "generated/prisma";
import { isUUID } from "class-validator";
import { PageOptionsDto } from "src/common/dtos/pagination/page-options.dto";
import { PageDto } from "src/common/dtos/pagination/page.dto";
import { AlbumEntity } from "./entities/album.entity";
import { PageMetaDto } from "src/common/dtos/pagination/page-meta.dto";
import { MediaService } from "src/media/media.service";
import { UpdateAlbumDto } from "./dto/update-album.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AlbumsService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private mediaService: MediaService
  ) {}

  async create(dto: CreateAlbumDto) {
    const slug = await this.slugService.generateUniqueSlug(dto.title, "album");

    return await this.prisma.album.create({
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
        songs: true,
        genres: true,
        likedBy: true,
      },
    });
  }

  async findAllStatic() {
    return await this.prisma.album.findMany({
      select: {
        slug: true,
      },
    });
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<AlbumEntity>> {
    const where: Prisma.AlbumWhereInput = {};

    const [entities, itemCount] = await this.prisma.$transaction([
      this.prisma.album.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
        include: {
          artist: true,
        },
      }),

      this.prisma.album.count({ where }),
    ]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(
      entities.map((e) => plainToInstance(AlbumEntity, e)),
      pageMetaDto
    );
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
    });

    if (!album) throw new NotFoundException("Album not found");

    return album;
  }

  async findOneDetails(identifier: string) {
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
        songs: true,
        genres: true,
        likedBy: true,
      },
    });

    if (!album) throw new NotFoundException("Album not found");

    return album;
  }

  async update(id: string, dto: UpdateAlbumDto) {
    let newSlug: string | undefined = undefined;

    if (dto.title) {
      newSlug = await this.slugService.generateUniqueSlug(dto.title, "album");
    }

    const oldAlbum = await this.prisma.album.findUnique({
      where: { id },
      select: { thumbnailId: true },
    });

    if (!oldAlbum) throw new NotFoundException("Album not found");

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: { ...dto, slug: newSlug },
    });

    if (
      dto.thumbnailId &&
      oldAlbum.thumbnailId &&
      dto.thumbnailId !== oldAlbum.thumbnailId
    ) {
      await this.mediaService
        .deleteImage(oldAlbum.thumbnailId)
        .catch((err) => console.error(err));
    }

    return updatedAlbum;
  }

  async remove(id: string) {
    const existingAlbum = await this.prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        thumbnailId: true,
      },
    });

    if (!existingAlbum) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    const deletedRecord = await this.prisma.album.delete({
      where: { id },
    });

    if (existingAlbum.thumbnailId) {
      this.mediaService
        .deleteImage(existingAlbum.thumbnailId)
        .catch((err) => console.error(err));
    }

    return deletedRecord;
  }
}
