"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface ImageUploadProps {
  value?: File | string | null;
  onChange: (file: File | null) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label,
  className,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onChange(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    [onChange]
  );

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div className={className}>
      {label && <p className="mb-2 text-sm font-medium">{label}</p>}

      <div
        {...getRootProps()}
        className={`
          relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition
          ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:bg-accent"
          }
          ${preview ? "border-none p-0" : "p-6"}
        `}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image src={preview} alt="Upload" fill className="object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs">Drag & drop or click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
}
