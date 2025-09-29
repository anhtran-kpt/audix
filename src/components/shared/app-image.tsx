"use client";

import { CldImage, CldImageProps } from "next-cloudinary";
import clsx from "clsx";
import { useState } from "react";

type Variant = "avatar" | "cover" | "thumbnail" | "banner";

interface AppImageProps extends Omit<CldImageProps, "width" | "height"> {
  variant?: Variant;
  className?: string;
  containerClassName?: string;
  responsive?: boolean;
}

const VARIANT_STYLES: Record<
  Variant,
  { width: number; height: number; className?: string; sizes?: string }
> = {
  avatar: {
    width: 64,
    height: 64,
    className: "rounded-full object-cover",
    sizes: "64px",
  },
  cover: {
    width: 300,
    height: 300,
    className: "rounded-lg object-cover",
    sizes: "(max-width: 768px) 50vw, 300px",
  },
  thumbnail: {
    width: 48,
    height: 48,
    className: "rounded-sm object-cover",
    sizes: "(max-width: 768px) 33vw, 48px",
  },
  banner: {
    width: 1200,
    height: 400,
    className: "rounded-xl object-cover",
    sizes: "(max-width: 768px) 100vw, 1200px",
  },
};

export function AppImage({
  variant = "thumbnail",
  className,
  containerClassName,
  responsive = false,
  onLoad,
  ...props
}: AppImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad: NonNullable<CldImageProps["onLoad"]> = (e) => {
    onLoad?.(e);
    setIsLoaded(true);
  };
  const {
    width,
    height,
    className: defaultClass,
    sizes,
  } = VARIANT_STYLES[variant];

  const imageEl = (
    <CldImage
      {...props}
      width={responsive ? undefined : width}
      height={responsive ? undefined : height}
      sizes={responsive ? sizes : undefined}
      fill={responsive ? true : undefined}
      className={clsx(defaultClass, className)}
      quality={props.quality ?? "auto"}
      format={props.format ?? "auto"}
      style={{ opacity: isLoaded ? 1 : 0 }}
      onLoad={handleLoad}
    />
  );

  if (responsive) {
    return (
      <div className={clsx("relative", containerClassName)}>{imageEl}</div>
    );
  }

  return imageEl;
}
