"use client";

import { NavLink } from "@/components/ui/nav-link";
import SectionHeading from "@/components/ui/section-heading";
import { TAlbum } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CldImage } from "next-cloudinary";
import PlayButton from "@/components/ui/play-button";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

import { albumTypeMap } from "@/lib/constants/enum-maps";
import Dot from "@/components/ui/dot";

type HotAlbumsSectionProps = {
  albums: TAlbum[];
};

export const HotAlbumsSection = ({ albums }: HotAlbumsSectionProps) => {
  return (
    <section>
      <div className="flex justify-between items-center">
        <SectionHeading heading="Hot albums" />
        <NavLink href={`/hot-albums`}>Show all</NavLink>
      </div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-6">
          {albums.map((album) => (
            <CarouselItem className="basis-1/6 pl-6" key={album.id}>
              <div
                key={album.slug}
                className="flex flex-col group gap-2 overflow-hidden"
              >
                <div className="relative rounded-md overflow-hidden size-full aspect-square">
                  <CldImage
                    src={album.imageId}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 group-hover:brightness-75"
                    sizes="20vw"
                  />
                  <PlayButton
                    className={cn(
                      "absolute bottom-2 right-2",
                      "opacity-0 translate-y-2 scale-95",
                      "transition-all duration-300",
                      "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                    )}
                  />
                </div>
                <div className="flex flex-col items-start w-full min-w-0">
                  <NavLink
                    href={`/albums/${album.id}`}
                    className="text-[calc(15rem/16)] truncate w-full"
                  >
                    {album.title}
                  </NavLink>
                  <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
                    <span>{formatDate(album.releaseDate, "yyyy")}</span>
                    <Dot />
                    <span>{albumTypeMap[album.albumType]}</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </section>
  );
};
