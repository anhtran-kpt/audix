"use client";

import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { NewPlaylistForm } from "../forms/new-playlist-form";
import { useRouter } from "next/navigation";

export const NewPlaylistDialog = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          New playlist
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center">Create new playlist</DialogTitle>
        </DialogHeader>
        <NewPlaylistForm
          onSuccess={(res) => {
            setOpen(false);
            router.push(`/playlists/${res.id}`);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
