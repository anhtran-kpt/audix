import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
} from "@nestjs/common";
import { AlbumsService } from "./albums.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AlbumEntity } from "./entities/album.entity";
import { AlbumListResponse } from "./dto/album-response.dto";

@ApiTags("Albums")
@Controller("albums")
@UseInterceptors(ClassSerializerInterceptor)
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @ApiCreatedResponse({
    description: "Created successful",
    type: AlbumEntity,
  })
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.albumsService.create(createAlbumDto);
    return new AlbumEntity(newAlbum);
  }

  @Get()
  @ApiOkResponse({
    description: "Get album list",
    type: [AlbumListResponse],
  })
  async findAll() {
    const albums = await this.albumsService.findAll();
    return albums.map((album) => new AlbumListResponse(album));
  }

  @Get(":identifier")
  @ApiOkResponse({
    description: "Get album details",
    type: AlbumEntity,
  })
  async findOne(@Param("identifier") identifier: string) {
    const album = await this.albumsService.findOne(identifier);
    return new AlbumEntity(album);
  }
}
