import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  Delete,
} from "@nestjs/common";
import { ArtistsService } from "./artists.service";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { User } from "generated/prisma";

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

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: string) {
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
