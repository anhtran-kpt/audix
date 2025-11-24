import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from "@nestjs/common";
import { GenresService } from "./genres.service";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { GenreEntity } from "./entities/genre.entity";
import { UserRole } from "src/auth/enums/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { PageOptionsDto } from "src/common/dtos/pagination/page-options.dto";
import { ApiPaginatedResponse } from "src/common/dtos/pagination/api-paginated-response.decorator";
import { PageDto } from "src/common/dtos/pagination/page.dto";

@Controller("genres")
@UseInterceptors(ClassSerializerInterceptor)
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiCreatedResponse({
    type: [GenreEntity],
    description: "Created successful",
  })
  async create(@Body() createGenreDto: CreateGenreDto) {
    const newGenre = await this.genresService.create(createGenreDto);
    return new GenreEntity(newGenre);
  }

  @Get()
  @ApiPaginatedResponse(GenreEntity)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<GenreEntity>> {
    return this.genresService.findAll(pageOptionsDto);
  }

  @Get(":id")
  @ApiOkResponse({
    type: GenreEntity,
    description: "Get basic genre info by id",
  })
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const genre = await this.genresService.findOne(id);
    return new GenreEntity(genre);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    type: [GenreEntity],
    description: "Updated successful",
  })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateGenreDto: UpdateGenreDto
  ) {
    const updatedGenre = await this.genresService.update(id, updateGenreDto);
    return new GenreEntity(updatedGenre);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.genresService.remove(+id);
  }
}
