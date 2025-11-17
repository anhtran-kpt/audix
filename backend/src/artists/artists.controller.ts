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
} from "@nestjs/common";
import { ArtistsService } from "./artists.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { User } from "generated/prisma";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";

@Controller("artists")
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get("all-static")
  findAllStatic() {
    return this.artistsService.findAllStatic();
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.artistsService.findAll(paginationDto);
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.artistsService.findOne(id);
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
