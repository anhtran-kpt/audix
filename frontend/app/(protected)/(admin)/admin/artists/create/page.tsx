"use client";

import { ArtistForm } from "@/features/artists/components/admin/artist-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateArtistPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/artists">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Artist</h1>
          <p className="text-muted-foreground">
            Add a new artist to your platform
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <ArtistForm />
      </div>
    </div>
  );
}
