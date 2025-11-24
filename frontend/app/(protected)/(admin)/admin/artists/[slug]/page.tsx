"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { ArtistForm } from "@/features/artists/components/admin/artist-form";
import { Button } from "@/components/ui/button";
import { getArtist } from "@/features/artists/api/client";
import { artistKeys } from "@/features/artists/api/keys";

export default function EditArtistPage() {
  const params = useParams();
  const artistSlug = params.slug as string;

  const {
    data: artist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: artistKeys.details(artistSlug),
    queryFn: () => getArtist(artistSlug),
    enabled: !!artistSlug,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !artist) {
    return <div>Artist not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/artists">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Artist</h1>
          <p className="text-muted-foreground">
            Update information for {artist.name}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <ArtistForm initialData={{ ...artist, bio: artist.bio ?? "" }} />
      </div>
    </div>
  );
}
