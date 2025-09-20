"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState, ReactNode } from "react";
import { NewPlaylistForm } from "../forms/new-playlist-form";
import { useRouter } from "next/navigation";

interface NewPlaylistDialogProps {
  trigger: ReactNode;
}

export const NewPlaylistDialog = ({ trigger }: NewPlaylistDialogProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="flex">
        {trigger}
      </div>
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
