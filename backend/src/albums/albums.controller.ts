import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { AlbumsService } from "./albums.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AlbumEntity } from "./entities/album.entity";
import { AlbumDetailResponse } from "./dto/album-detail-response.dto";
import { AlbumSlug } from "./dto/album-slug.dto";
import { AlbumItemResponse } from "./dto/album-item-response.dto";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UserRole } from "src/auth/enums/role.enum";

@ApiTags("Albums")
@Controller("albums")
@UseInterceptors(ClassSerializerInterceptor)
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCreatedResponse({
    description: "Created successful",
    type: AlbumEntity,
  })
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.albumsService.create(createAlbumDto);
    return new AlbumEntity(newAlbum as any);
  }

  @Get()
  @ApiOkResponse({
    description: "Get full static albums",
    type: [AlbumSlug],
  })
  async findAllStatic() {
    const albums = await this.albumsService.findAllStatic();
    return albums.map((album) => new AlbumSlug(album));
  }

  @Get()
  @ApiOkResponse({
    description: "Get album list",
    type: [AlbumItemResponse],
  })
  async findAll() {
    const albums = await this.albumsService.findAll();
    // return albums.map((album) => new AlbumItemResponse(album));
    return albums;
  }

  @Get(":identifier")
  @ApiOkResponse({
    description: "Get album details",
    type: AlbumDetailResponse,
  })
  async findOne(@Param("identifier") identifier: string) {
    const album = await this.albumsService.findOne(identifier);
    // return new AlbumDetailResponse(album);
    return album;
  }
}
