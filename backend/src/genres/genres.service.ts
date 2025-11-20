import { Injectable } from "@nestjs/common";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SlugService } from "src/common/services/slug.service";
import { Genre } from "generated/prisma";

@Injectable()
export class GenresService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService
  ) {}

  async create(dto: CreateGenreDto) {
    const slug = await this.slugService.generateUniqueSlug(dto.name, "genre");

    return await this.prisma.artist.create({
      data: {
        ...dto,
        slug: slug,
      },
    });
  }

  findAll() {
    return `This action returns all genres`;
  }

  findOne(id: number) {
    return `This action returns a #${id} genre`;
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
