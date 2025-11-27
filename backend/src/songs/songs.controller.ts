import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { SongsService } from "./songs.service";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UserRole } from "src/auth/enums/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { SongEntity } from "./entities/song.entity";
import { plainToInstance } from "class-transformer";
import { CreateSongDto } from "./dto/create-song.dto";
import { UpdateSongDto } from "./dto/update-song.dto";

@ApiTags("Songs")
@Controller("songs")
@UseInterceptors(ClassSerializerInterceptor)
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCreatedResponse({
    description: "Created successful",
    type: SongEntity,
  })
  async create(@Body() createSongDto: CreateSongDto) {
    const newSong = await this.songsService.create(createSongDto);
    return plainToInstance(SongEntity, newSong);
  }

  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.songsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(+id, updateSongDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.songsService.remove(+id);
  }
}
