import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Query,
  Patch,
  Delete,
} from "@nestjs/common";
import { AlbumsService } from "./albums.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AlbumEntity } from "./entities/album.entity";
import { AlbumDetailsResponse } from "./dto/album-details-response.dto";
import { AlbumSlug } from "./dto/album-slug.dto";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UserRole } from "src/auth/enums/role.enum";
import { plainToInstance } from "class-transformer";
import { ApiPaginatedResponse } from "src/common/dtos/pagination/api-paginated-response.decorator";
import { PageOptionsDto } from "src/common/dtos/pagination/page-options.dto";
import { PageDto } from "src/common/dtos/pagination/page.dto";
import { UpdateAlbumDto } from "./dto/update-album.dto";

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
    return plainToInstance(AlbumEntity, newAlbum);
  }

  @Get("all-static")
  @ApiOkResponse({
    description: "Get full static albums",
    type: [AlbumSlug],
  })
  async findAllStatic() {
    const albums = await this.albumsService.findAllStatic();
    return albums.map((album) => new AlbumSlug(album));
  }

  @Get()
  @ApiPaginatedResponse(AlbumEntity)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<AlbumEntity>> {
    return await this.albumsService.findAll(pageOptionsDto);
  }

  @Get(":identifier")
  @ApiOkResponse({
    description: "Get album by identifier",
    type: AlbumEntity,
  })
  async findOne(@Param("identifier") identifier: string) {
    const album = await this.albumsService.findOne(identifier);
    return plainToInstance(AlbumEntity, album);
  }

  @Get(":identifier/details")
  @ApiOkResponse({
    description: "Get album detail by identifier",
    type: AlbumDetailsResponse,
  })
  async findOneDetails(@Param("identifier") identifier: string) {
    const album = await this.albumsService.findOneDetails(identifier);
    return plainToInstance(AlbumDetailsResponse, album);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: [AlbumEntity],
    description: "Album updated successful",
  })
  async update(
    @Param("id") id: string,
    @Body() updateAlbumDto: UpdateAlbumDto
  ) {
    const updatedAlbum = await this.albumsService.update(id, updateAlbumDto);
    return new AlbumEntity(updatedAlbum);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: [AlbumEntity],
    description: "Album removed successful",
  })
  async remove(@Param("id") id: string) {
    const updatedAlbum = await this.albumsService.remove(id);
    return new AlbumEntity(updatedAlbum);
  }
}
