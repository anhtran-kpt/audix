"use client";

import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { NewPlaylistForm } from "../forms/new-playlist-form";
import { useRouter } from "next/navigation";
import { IconButton } from "../ui/icon-button";

export const NewPlaylistDialog = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton icon={PlusIcon} tooltipContent="Create new playlist" />
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
