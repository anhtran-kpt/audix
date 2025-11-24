"use client";

import { GenreForm } from "@/features/genres/components/admin/genre-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateGenrePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/genres">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Genre</h1>
          <p className="text-muted-foreground">
            Add a new genre to your platform
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <GenreForm />
      </div>
    </div>
  );
}
