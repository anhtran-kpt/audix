import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import slugify from "slugify";

type SluggableModelName = "artist" | "album" | "playlist" | "genre";

interface SluggableDelegate {
  findUnique(args: { where: { slug: string } }): Promise<any>;
}

@Injectable()
export class SlugService {
  constructor(private readonly prisma: PrismaService) {}

  async generateUniqueSlug(
    name: string,
    modelName: SluggableModelName
  ): Promise<string> {
    const delegate = this.getPrismaDelegate(modelName);

    const baseSlug = slugify(name, {
      lower: true,
      strict: true,
      locale: "vi",
      trim: true,
      replacement: "-",
    });

    let uniqueSlug = baseSlug;
    let counter = 2;

    while (await delegate.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  private getPrismaDelegate(modelName: SluggableModelName): SluggableDelegate {
    switch (modelName) {
      case "artist":
        return this.prisma.artist;
      case "album":
        return this.prisma.album;
      case "playlist":
        return this.prisma.playlist;
      case "genre":
        return this.prisma.genre;
      default:
        throw new InternalServerErrorException(
          "Invalid model name for slug service"
        );
    }
  }
}
