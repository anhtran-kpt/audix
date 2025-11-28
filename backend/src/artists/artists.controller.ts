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
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { ArtistsService } from "./artists.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { User } from "generated/prisma";
import { Roles } from "src/auth/roles.decorator";
import { UserRole } from "src/auth/enums/role.enum";
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ArtistEntity } from "./entities/artist.entity";
import { PageOptionsDto } from "src/common/dtos/pagination/page-options.dto";
import { PageDto } from "src/common/dtos/pagination/page.dto";
import { ApiPageOkResponse } from "src/common/decorators/api-page-ok-response.decorator";
import { ArtistSlugResponse } from "./dtos/artist-slug-response.dto";
import { CreateArtistDto } from "./dtos/create-artist.dto";
import { UpdateArtistDto } from "./dtos/update-artist.dto";
import { ArtistDetailsResponse } from "./dtos/artist-details-response.dto";
import { plainToInstance } from "class-transformer";

@Controller("artists")
@UseInterceptors(ClassSerializerInterceptor)
@ApiExtraModels(PageOptionsDto, PageDto, ArtistEntity)
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
  @ApiOperation({ summary: "Get list of artists with pagination and search" })
  @ApiPageOkResponse(ArtistEntity)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<ArtistEntity>> {
    return this.artistsService.findAll(pageOptionsDto);
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
    description: "Artist updated successful",
  })
  async update(
    @Param("id") id: string,
    @Body() updateArtistDto: UpdateArtistDto
  ) {
    const updatedArtist = await this.artistsService.update(id, updateArtistDto);
    return new ArtistEntity(updatedArtist);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: [ArtistEntity],
    description: "Removed successful",
  })
  async remove(@Param("id") id: string) {
    const updatedArtist = await this.artistsService.remove(id);
    return new ArtistEntity(updatedArtist);
  }

  @Get(":identifier")
  @ApiOkResponse({
    type: ArtistEntity,
    description: "Get basic artist info by identifier",
  })
  async findOne(@Param("identifier") identifier: string) {
    const artist = await this.artistsService.findOne(identifier);
    return plainToInstance(ArtistEntity, artist);
  }

  @Get(":identifier/details")
  @ApiOkResponse({
    type: ArtistDetailsResponse,
    description: "Get artist profile by id or slug",
  })
  async findOneDetails(@Param("identifier") identifier: string) {
    const artist = await this.artistsService.findOneDetails(identifier);
    return new ArtistDetailsResponse(artist);
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
}
