"use client";

import { AlbumCreateForm } from "@/features/albums/components/admin/album-create-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateAlbumPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/albums">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Album</h1>
          <p className="text-muted-foreground">
            Add a new album to your platform
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <AlbumCreateForm />
      </div>
    </div>
  );
}
