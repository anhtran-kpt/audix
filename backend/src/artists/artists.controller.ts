import { Controller, Get, Query } from "@nestjs/common";
import { ArtistsService } from "./artists.service";
import { PaginationDto } from "src/common/dto/pagination.dto";

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
}
