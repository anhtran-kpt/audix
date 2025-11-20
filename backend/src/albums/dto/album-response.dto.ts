import { PickType } from "@nestjs/swagger";
import { AlbumEntity } from "../entities/album.entity";

// Response cho danh sách (gọn nhẹ)
export class AlbumListResponse extends PickType(AlbumEntity, [
  "id",
  "title",
  "slug",
  "thumbnailId",
  "type",
  "artist",
] as const) {}

// Response cho chi tiết (đầy đủ)
export class AlbumDetailResponse extends AlbumEntity {
  // Có thể thêm Songs[] ở đây nếu muốn
}
