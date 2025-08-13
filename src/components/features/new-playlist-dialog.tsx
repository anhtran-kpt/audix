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
import { useState } from "react";
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
          onSuccess={(redirectTo) => {
            setOpen(false);
            router.push(redirectTo, { scroll: false });
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
