"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useRef } from "react";

type EntityCarouselProps<T extends { id: string }> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

export const EntityCarousel = <T extends { id: string }>({
  data,
  renderItem,
}: EntityCarouselProps<T>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const limit = useResponsiveLimit(wrapperRef);

  return (
    <Carousel
      ref={wrapperRef}
      opts={{
        align: "start",
        slidesToScroll: 1,
      }}
    >
      <CarouselContent>
        {data.map((item, index) => (
          <CarouselItem
            key={item.id}
            style={{
              flexBasis: `calc(100% / ${limit})`,
              transition: "flex-basis 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: `${index * 40}ms`,
            }}
            className="shrink-0 pl-responsive/2"
          >
            {renderItem(item, index)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
