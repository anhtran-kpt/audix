"use client";

import { AlbumItem as AlbumItemType } from "@/features/album/contracts/album-dto";
import { GridWrapper } from "../ui/grid-wrapper";
import { AlbumItem } from "./album-item";

export const AlbumGrid = ({ albums }: { albums: AlbumItemType[] }) => {
  return (
    <GridWrapper>
      {albums.map((album) => (
        <AlbumItem
          key={album.id}
          id={album.id}
          title={album.title}
          imageId={album.imageId}
          releaseDate={album.releaseDate}
          albumType={album.albumType}
        />
      ))}
    </GridWrapper>
  );
};
