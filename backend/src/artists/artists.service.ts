import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { isUUID } from "class-validator";
import { Artist, Prisma } from "generated/prisma";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SlugService } from "src/common/services/slug.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";

@Injectable()
export class ArtistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slugService: SlugService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async findAllStatic(): Promise<Pick<Artist, "slug">[]> {
    return await this.prisma.artist.findMany({
      select: {
        slug: true,
      },
    });
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

    const [popularSongs, albums, singlesAndEps] = await Promise.all([
      this.prisma.songArtist.findMany({
        where: { artistId: artist.id },
        select: {
          song: {
            select: {
              id: true,
              title: true,
              audioId: true,
              duration: true,
              songNumber: true,
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

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    let newSlug: string | undefined = undefined;

    if (updateArtistDto.name) {
      newSlug = await this.slugService.generateUniqueSlug(
        updateArtistDto.name,
        "artist"
      );
    }

    return await this.prisma.artist.update({
      where: { id },
      data: {
        ...updateArtistDto,
        slug: newSlug,
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

  async updateAvatar(artistId: string, file: Express.Multer.File) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
      select: { avatarId: true },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    const oldAvatarId = artist.avatarId;

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      "artist_avatars"
    );
    const newPublicId = uploadResult.public_id;
    const dominantColor = uploadResult.colors?.[0]?.[0] || null;

    const updatedArtist = await this.prisma.artist.update({
      where: { id: artistId },
      data: {
        avatarId: newPublicId,
        avatarColor: dominantColor,
      },
    });

    if (oldAvatarId) {
      try {
        await this.cloudinaryService.deleteImage(oldAvatarId);
      } catch (error) {
        console.error(`Failed to delete old avatar ${oldAvatarId}:`, error);
      }
    }

    return updatedArtist;
  }

  async updateBanner(artistId: string, file: Express.Multer.File) {
    const artist = await this.prisma.artist.findUnique({
      where: { id: artistId },
      select: { bannerId: true },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    const oldBannerId = artist.bannerId;

    const uploadResult = await this.cloudinaryService.uploadImage(
      file,
      "artist_banners"
    );
    const newPublicId = uploadResult.public_id;
    const dominantColor = uploadResult.colors?.[0]?.[0] || null;

    const updatedArtist = await this.prisma.artist.update({
      where: { id: artistId },
      data: {
        bannerId: newPublicId,
        avatarColor: dominantColor,
      },
    });

    if (oldBannerId) {
      try {
        await this.cloudinaryService.deleteImage(oldBannerId);
      } catch (error) {
        console.error(`Failed to delete old avatar ${oldBannerId}:`, error);
      }
    }

    return updatedArtist;
  }
}
