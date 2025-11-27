import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { isUUID } from "class-validator";
import { Artist, Prisma } from "generated/prisma";
import { SlugService } from "src/common/services/slug.service";
import { PrismaService } from "src/prisma/prisma.service";
import { PageDto } from "src/common/dtos/pagination/page.dto";
import { ArtistEntity } from "./entities/artist.entity";
import { PageMetaDto } from "src/common/dtos/pagination/page-meta.dto";
import { MediaService } from "src/media/media.service";
import { ArtistPageOptionsDto } from "./dtos/artist-base-options.dto";
import { plainToInstance } from "class-transformer";
import { CreateArtistDto } from "./dtos/create-artist.dto";
import { UpdateArtistDto } from "./dtos/update-artist.dto";

@Injectable()
export class ArtistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slugService: SlugService,
    private readonly mediaService: MediaService
  ) {}

  async findAllStatic(): Promise<Pick<Artist, "slug">[]> {
    return await this.prisma.artist.findMany({
      select: {
        slug: true,
      },
    });
  }

  async findAll(
    pageOptionsDto: ArtistPageOptionsDto
  ): Promise<PageDto<ArtistEntity>> {
    const where: Prisma.ArtistWhereInput = {};

    if (pageOptionsDto.searchQuery) {
      where.OR = [
        { name: { contains: pageOptionsDto.searchQuery, mode: "insensitive" } },
        { slug: { contains: pageOptionsDto.searchQuery, mode: "insensitive" } },
      ];
    }

    // if (pageOptionsDto.nationality) {
    //   where.nationality = pageOptionsDto.nationality;
    // }

    const [entities, itemCount] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.takeNumber,
        orderBy: {
          createdAt: pageOptionsDto.orderValue,
        },
      }),

      this.prisma.artist.count({ where }),
    ]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(
      entities.map((e) => plainToInstance(ArtistEntity, e)),
      pageMetaDto
    );
  }

  async findOne(identifier: string) {
    let where: Prisma.ArtistWhereUniqueInput;

    if (isUUID(identifier)) {
      where = { id: identifier };
    } else {
      where = { slug: identifier };
    }

    const artist = await this.prisma.artist.findUnique({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        avatarId: true,
        bannerId: true,
        avatarColor: true,
        bannerColor: true,
        bio: true,
        followersCount: true,
      },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    return artist;
  }

  async findOneDetails(identifier: string) {
    let where: Prisma.ArtistWhereUniqueInput;

    if (isUUID(identifier)) {
      where = { id: identifier };
    } else {
      where = { slug: identifier };
    }

    const artist = await this.prisma.artist.findUnique({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        avatarId: true,
        bannerId: true,
        avatarColor: true,
        bannerColor: true,
        bio: true,
        followersCount: true,
      },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    const [popularSongs, albums, singlesAndEps] = await Promise.all([
      this.prisma.songArtist.findMany({
        where: { artistId: artist.id },
        select: {
          song: {
            select: {
              id: true,
              title: true,
              slug: true,
              audioId: true,
              duration: true,
              order: true,
              isExplicit: true,
              playCount: true,
            },
          },
        },
        take: 5,
        orderBy: {
          song: {
            playCount: "desc",
          },
        },
      }),

      this.prisma.album.findMany({
        where: { artistId: artist.id, type: "ALBUM" },
        orderBy: [{ releaseDate: "desc" }, { id: "desc" }],
        take: 5,
        select: {
          id: true,
          title: true,
          thumbnailId: true,
          type: true,
          releaseDate: true,
          artist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      this.prisma.album.findMany({
        where: { artistId: artist.id, type: { in: ["SINGLE", "EP"] } },
        take: 5,
        orderBy: [{ releaseDate: "desc" }, { id: "desc" }],
        select: {
          id: true,
          title: true,
          thumbnailId: true,
          type: true,
          releaseDate: true,
          artist: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      info: artist,
      popularSongs: popularSongs.map((sa) => sa.song),
      discography: {
        albums,
        singlesAndEps,
      },
    };
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const slug = await this.slugService.generateUniqueSlug(
      createArtistDto.name,
      "artist"
    );

    return await this.prisma.artist.create({
      data: {
        ...createArtistDto,
        slug: slug,
      },
    });
  }

  async follow(artistId: string, userId: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    const existingFollow = await this.prisma.userFollowedArtist.findUnique({
      where: { userId_artistId: { userId, artistId } },
    });

    if (existingFollow) {
      throw new ConflictException("User already follows this artist");
    }

    const [followRecord] = await this.prisma.$transaction([
      this.prisma.userFollowedArtist.create({
        data: { userId, artistId },
      }),

      this.prisma.artist.update({
        where: { id: artistId },
        data: {
          followersCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return followRecord;
  }

  async unfollow(artistId: string, userId: string) {
    const existingFollow = await this.prisma.userFollowedArtist.findUnique({
      where: { userId_artistId: { userId, artistId } },
    });

    if (!existingFollow) {
      throw new NotFoundException("Follow relationship not found");
    }

    const [deletedRecord] = await this.prisma.$transaction([
      this.prisma.userFollowedArtist.delete({
        where: { userId_artistId: { userId, artistId } },
      }),

      this.prisma.artist.update({
        where: { id: artistId },
        data: {
          followersCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return deletedRecord;
  }

  async update(id: string, dto: UpdateArtistDto) {
    let newSlug: string | undefined = undefined;

    if (dto.name) {
      newSlug = await this.slugService.generateUniqueSlug(dto.name, "artist");
    }

    const oldArtist = await this.prisma.artist.findUnique({
      where: { id },
      select: { avatarId: true, bannerId: true },
    });

    if (!oldArtist) throw new NotFoundException("Artist not found");

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: { ...dto, slug: newSlug },
    });

    void this.handleCleanupImages(oldArtist, dto);

    return updatedArtist;
  }

  async remove(id: string) {
    const existingArtist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarId: true,
        bannerId: true,
      },
    });

    if (!existingArtist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    const deletedRecord = await this.prisma.artist.delete({
      where: { id },
    });

    if (existingArtist.avatarId) {
      this.mediaService
        .deleteImage(existingArtist.avatarId)
        .catch((err) => console.error(err));
    }

    if (existingArtist.bannerId) {
      this.mediaService
        .deleteImage(existingArtist.bannerId)
        .catch((err) => console.error(err));
    }

    return deletedRecord;
  }

  private async handleCleanupImages(
    oldArtist: { avatarId: string | null; bannerId: string | null },
    newDto: UpdateArtistDto
  ) {
    if (
      newDto.avatarId &&
      oldArtist.avatarId &&
      newDto.avatarId !== oldArtist.avatarId
    ) {
      await this.mediaService
        .deleteImage(oldArtist.avatarId)
        .catch((err) => console.error(err));
    }

    if (
      newDto.bannerId &&
      oldArtist.bannerId &&
      newDto.bannerId !== oldArtist.bannerId
    ) {
      await this.mediaService
        .deleteImage(oldArtist.bannerId)
        .catch((err) => console.error(err));
    }
  }
}
