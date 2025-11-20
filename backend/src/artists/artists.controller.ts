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
import { ApiOkResponse } from "@nestjs/swagger";
import {
  ArtistSlugResponse,
  FullArtistResponse,
} from "./dto/artist-response.dto";
import { RolesGuard } from "src/auth/guards/roles.guard";

@Controller("artists")
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get("all-static")
  @ApiOkResponse({
    type: [ArtistSlugResponse],
    description: "Get all static artists",
  })
  findAllStatic() {
    return this.artistsService.findAllStatic();
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.artistsService.findAll(paginationDto);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param("id") id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Get(":identifier")
  @ApiOkResponse({
    type: FullArtistResponse,
    description: "Get artist by identifier",
  })
  findOne(@Param("identifier") identifier: string) {
    return this.artistsService.findOne(identifier);
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
}
