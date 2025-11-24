"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAlbum } from "@/features/albums/api/client";
import { albumKeys } from "@/features/albums/api/keys";
import { AlbumForm } from "@/features/albums/components/admin/album-form";

export default function EditAlbumPage() {
  const params = useParams();
  const albumSlug = params.slug as string;

  const {
    data: album,
    isLoading,
    isError,
  } = useQuery({
    queryKey: albumKeys.details(albumSlug),
    queryFn: () => getAlbum(albumSlug),
    enabled: !!albumSlug,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !album) {
    return <div>Album not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/albums">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit album</h1>
          <p className="text-muted-foreground">
            Update information for {album.title}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <AlbumForm initialData={album} />
      </div>
    </div>
  );
}
