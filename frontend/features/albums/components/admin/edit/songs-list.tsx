"use client";

import { useState } from "react";
import { Edit, Trash, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { SongDialog } from "./song-dialog";
import { toast } from "sonner";
import { formatDuration } from "@/features/common/utils/format-duration";
import { SongEntity } from "@/features/common/types/entity.type";
import { deleteSong } from "@/features/songs/api/client";

interface SongsListProps {
  songs: SongEntity[];
  albumId: string;
  defaultArtistId: string;
}

export function SongsList({ songs, albumId, defaultArtistId }: SongsListProps) {
  const queryClient = useQueryClient();
  const [editingSong, setEditingSong] = useState<SongEntity | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (songId: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;
    try {
      await deleteSong(songId);
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      toast.success("Song deleted");
    } catch (error) {
      toast.error("Failed to delete song");
    }
  };

  const openCreate = () => {
    setEditingSong(undefined);
    setIsDialogOpen(true);
  };

  const openEdit = (song: SongEntity) => {
    setEditingSong(song);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tracklist ({songs.length})</h3>
        <Button onClick={openCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Track
        </Button>
      </div>

      <div className="space-y-2">
        {songs.map((song, index) => (
          <Card
            key={song.id}
            className="p-3 flex items-center gap-4 hover:bg-muted/40 transition-colors"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />

            <div className="w-8 text-center font-mono text-muted-foreground">
              {index + 1}
            </div>

            <div className="flex-1">
              <div className="font-medium">{song.title}</div>
              <div className="text-xs text-muted-foreground">
                {formatDuration(song.duration)} •{" "}
                {song.artists?.map((a) => a.artist?.name).join(", ")}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEdit(song)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600"
                onClick={() => handleDelete(song.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}

        {songs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded">
            No songs in this album yet.
          </div>
        )}
      </div>

      <SongDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        albumId={albumId}
        defaultArtistId={defaultArtistId}
        songToEdit={editingSong}
      />
    </div>
  );
}
