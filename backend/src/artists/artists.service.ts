import { Injectable } from "@nestjs/common";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllStatic() {
    return this.prisma.artist.findMany();
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const skip = (page - 1) * limit;

    const [artists, totalArtists] = await Promise.all([
      this.prisma.artist.findMany({
        take: limit,
        skip: skip,
      }),
      this.prisma.artist.count(),
    ]);

    const totalPages = Math.ceil(totalArtists / limit);

    return {
      data: artists,
      meta: {
        total: totalArtists,
        page: page,
        limit: limit,
        totalPages: totalPages,
      },
    };
  }
}
