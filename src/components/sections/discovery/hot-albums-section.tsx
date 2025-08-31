"use client";

import SectionHeading from "@/components/ui/section-heading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { AlbumItem as AlbumItemType } from "@/features/album/data-access/album-selects";
import { AlbumItem } from "@/components/features/album-item";

type HotAlbumsSectionProps = {
  albums: AlbumItemType[];
};

export const HotAlbumsSection = ({ albums }: HotAlbumsSectionProps) => {
  return (
    <section>
      <SectionHeading
        title="Hot Albums"
        hasShowAll={true}
        href={`/hot-albums`}
      />
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-6">
          {albums.map((album) => (
            <CarouselItem
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5 pl-6"
              key={album.id}
            >
              <AlbumItem
                id={album.id}
                title={album.title}
                imageId={album.imageId}
                releaseDate={album.releaseDate}
                albumType={album.albumType}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
