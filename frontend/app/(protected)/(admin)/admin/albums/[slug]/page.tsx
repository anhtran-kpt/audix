"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAlbum } from "@/features/albums/api/client";
import { albumKeys } from "@/features/albums/api/keys";
import { AlbumInfoForm } from "@/features/albums/components/admin/edit/album-info-form";
import { SongsList } from "@/features/albums/components/admin/edit/songs-list";

export default function EditAlbumPage() {
  const params = useParams();
  const albumSlug = params.slug as string;

  const { data: album, isLoading } = useQuery({
    queryKey: albumKeys.details(albumSlug),
    queryFn: async () => await getAlbum(albumSlug),
  });

  if (isLoading || !album) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Album: {album.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AlbumInfoForm initialData={album} />
        </div>

        <div className="lg:col-span-2">
          <SongsList
            songs={album.songs || []}
            albumId={album.id}
            defaultArtistId={album.artistId}
          />
        </div>
      </div>
    </div>
  );
}
