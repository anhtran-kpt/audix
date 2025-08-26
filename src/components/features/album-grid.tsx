"use client";

import { AlbumBase } from "@/contracts/album";
import { GridWrapper } from "../ui/grid-wrapper";
import { AlbumItem } from "./album-item";

type AlbumItem = Pick<
  AlbumBase,
  "id" | "imageId" | "title" | "releaseDate" | "albumType"
>;

export const AlbumGrid = ({ albums }: { albums: AlbumItem[] }) => {
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
