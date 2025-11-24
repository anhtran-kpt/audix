"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label,
  className,
  disabled,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof value === "string") {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file);
      }
    },
    [onChange]
  );

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    disabled: disabled,
  });

  return (
    <div className="w-full space-y-2">
      {label && (
        <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </p>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/25 transition hover:bg-accent/50",
          "aspect-video",
          isDragActive && "border-primary bg-primary/10",
          disabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
          preview && "border-none",
          className
        )}
      >
        <input {...getInputProps()} />

        {preview ? (
          <>
            <div className="relative h-full w-full">
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="absolute right-2 top-2 z-10">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-6 w-6 rounded-full shadow-sm"
                onClick={removeImage}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground px-4 text-center">
            <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-xs font-medium">
              {isDragActive ? "Drop file here" : "Drag & drop or click"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
