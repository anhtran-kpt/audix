import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllStatic() {
    return this.prisma.artist.findMany({
      select: {
        id: true,
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

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        imageId: true,
        followersCount: true,
        bannerId: true,
        bio: true,
        tracks: {
          select: {
            track: {
              select: {
                id: true,
                title: true,
                audioId: true,
                duration: true,
                trackNumber: true,
                isExplicit: true,
                playCount: true,
                album: {
                  select: {
                    id: true,
                    imageId: true,
                    title: true,
                    artist: {
                      select: {
                        id: true,
                        name: true,
                        imageId: true,
                      },
                    },
                  },
                },
                artists: {
                  select: {
                    artist: { select: { id: true, name: true } },
                  },
                  orderBy: { order: "asc" },
                },
              },
            },
          },
          take: 5,
          orderBy: {
            track: {
              playCount: "desc",
            },
          },
        },
      },
    });

    if (!artist) {
      throw new NotFoundException("Artist not found");
    }

    return {
      ...artist,
      tracks: artist.tracks
        .map((at) => at.track)
        .map((track) => ({
          ...track,
          artists: track.artists.map((ta) => ta.artist),
        })),
    };
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
}
