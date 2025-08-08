"use client";

import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

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
        <div className="grid gap-3">
          <Label htmlFor="playlist-title">Title</Label>
          <Input
            id="playlist-title"
            name="playlist-title"
            placeholder="Ex: My favorite songs"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="playlist-description">Description</Label>
          <Textarea
            id="playlist-description"
            name="playlist-description"
            placeholder="Ex: This is my favorite songs"
          />
        </div>
        <DialogFooter>
          <Button className="w-full">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
