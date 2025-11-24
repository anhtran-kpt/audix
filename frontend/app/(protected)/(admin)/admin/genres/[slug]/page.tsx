"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { GenreForm } from "@/features/genres/components/admin/genre-form";
import { Button } from "@/components/ui/button";
import { getGenre } from "@/features/genres/api/client";
import { genreKeys } from "@/features/genres/api/keys";

export default function EditGenrePage() {
  const params = useParams();
  const genreSlug = params.slug as string;

  const {
    data: genre,
    isLoading,
    isError,
  } = useQuery({
    queryKey: genreKeys.details(genreSlug),
    queryFn: () => getGenre(genreSlug),
    enabled: !!genreSlug,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !genre) {
    return <div>genre not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/genres">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit genre</h1>
          <p className="text-muted-foreground">
            Update information for {genre.name}
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <GenreForm initialData={genre} />
      </div>
    </div>
  );
}
