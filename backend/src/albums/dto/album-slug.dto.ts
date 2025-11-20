import { PickType } from "@nestjs/swagger";
import { AlbumEntity } from "../entities/album.entity";

export class AlbumSlug extends PickType(AlbumEntity, ["slug"] as const) {}
