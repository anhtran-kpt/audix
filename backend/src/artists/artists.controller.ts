import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  Delete,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { ArtistsService } from "./artists.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { User } from "generated/prisma";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "src/auth/roles.decorator";
import { UserRole } from "src/auth/enums/role.enum";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { ArtistSlugResponse } from "./dto/artist-slug-response.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ArtistDetailResponse } from "./dto/artist-detail-response.dto";
import { ArtistEntity } from "./entities/artist.entity";

@Controller("artists")
@UseInterceptors(ClassSerializerInterceptor)
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get("all-static")
  @ApiOkResponse({
    type: [ArtistSlugResponse],
    description: "Get all static artists",
  })
  async findAllStatic() {
    const artists = await this.artistsService.findAllStatic();
    return artists.map((artist) => new ArtistSlugResponse(artist));
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.artistsService.findAll(paginationDto);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCreatedResponse({
    type: [ArtistEntity],
    description: "Created successful",
  })
  async create(@Body() createArtistDto: CreateArtistDto) {
    const newArtist = await this.artistsService.create(createArtistDto);
    return new ArtistEntity(newArtist);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: [ArtistEntity],
    description: "Updated successful",
  })
  async update(
    @Param("id") id: string,
    @Body() updateArtistDto: UpdateArtistDto
  ) {
    const updatedArtist = await this.artistsService.update(id, updateArtistDto);
    return new ArtistEntity(updatedArtist);
  }

  @Get(":identifier")
  @ApiOkResponse({
    type: ArtistDetailResponse,
    description: "Get artist by identifier",
  })
  async findOne(@Param("identifier") identifier: string) {
    const artist = await this.artistsService.findOne(identifier);
    return new ArtistDetailResponse(artist);
  }

  @Post(":id/follow")
  @UseGuards(JwtAuthGuard)
  follow(@Param("id", ParseUUIDPipe) artistId: string, @AuthUser() user: User) {
    return this.artistsService.follow(artistId, user.id);
  }

  @Delete(":id/follow")
  @UseGuards(JwtAuthGuard)
  unfollow(
    @Param("id", ParseUUIDPipe) artistId: string,
    @AuthUser() user: User
  ) {
    return this.artistsService.unfollow(artistId, user.id);
  }

  @Patch(":id/avatar")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("avatar"))
  updateAvatar(
    @Param("id") artistId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.artistsService.updateAvatar(artistId, file);
  }

  @Patch(":id/banner")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("banner"))
  updateBanner(
    @Param("id") artistId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.artistsService.updateBanner(artistId, file);
  }
}
