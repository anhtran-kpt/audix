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
import { NewPlaylistForm } from "@/features/playlist/components/new-playlist-form";

export const NewPlaylistDialog = () => {
  return (
    <Dialog>
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
        <NewPlaylistForm />
      </DialogContent>
    </Dialog>
  );
};
