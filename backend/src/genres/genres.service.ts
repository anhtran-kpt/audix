import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SlugService } from "src/common/services/slug.service";
import { Genre, Prisma } from "generated/prisma";
import { PageOptionsDto } from "src/common/dtos/pagination/page-options.dto";
import { PageDto } from "src/common/dtos/pagination/page.dto";
import { GenreEntity } from "./entities/genre.entity";
import { PageMetaDto } from "src/common/dtos/pagination/page-meta.dto";

@Injectable()
export class GenresService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService
  ) {}

  async create(dto: CreateGenreDto) {
    const slug = await this.slugService.generateUniqueSlug(dto.name, "genre");

    return await this.prisma.genre.create({
      data: {
        ...dto,
        slug: slug,
      },
    });
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<GenreEntity>> {
    const where: Prisma.GenreWhereInput = {};

    const [entities, itemCount] = await this.prisma.$transaction([
      this.prisma.genre.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
      }),

      this.prisma.genre.count({ where }),
    ]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(
      entities.map((e) => new GenreEntity(e)),
      pageMetaDto
    );
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        songs: {
          include: {
            song: true,
          },
        },
        albums: {
          include: {
            album: true,
          },
        },
        artists: {
          include: {
            artist: true,
          },
        },
      },
    });

    if (!genre) {
      throw new NotFoundException("Genre not found");
    }

    return genre;
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    let newSlug: string | undefined = undefined;

    if (updateGenreDto.name) {
      newSlug = await this.slugService.generateUniqueSlug(
        updateGenreDto.name,
        "genre"
      );
    }

    return await this.prisma.genre.update({
      where: { id },
      data: {
        ...updateGenreDto,
        slug: newSlug,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} genre`;
  }
}
