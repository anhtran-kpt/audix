"use client";

import { useState, useEffect } from "react";
import { Edit, Trash, Plus, GripVertical, Clock } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteSong, reorderSongs } from "@/features/songs/api/client";
import { SongDialog } from "./song-dialog";
import { SongEntity } from "@/features/common/types/entity.type";
import { formatDuration } from "@/features/common/utils/format-duration";
import { albumKeys } from "@/features/albums/api/keys";
import { ArtistBasicInfo } from "../artist-select";

interface SongsListProps {
  songs: SongEntity[];
  albumId: string;
  defaultArtist: ArtistBasicInfo;
}

export function SongsList({ songs, albumId, defaultArtist }: SongsListProps) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState(songs);
  const [editingSong, setEditingSong] = useState<SongEntity | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setItems(songs);
  }, [songs]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);

    try {
      const songIds = newItems.map((item) => item.id);
      await reorderSongs(albumId, songIds);
    } catch (error) {
      toast.error("Failed to reorder songs");
      setItems(songs);
    }
  };

  const handleDelete = async (songId: string) => {
    if (!confirm("Delete this song? This cannot be undone.")) return;
    try {
      await deleteSong(songId);
      queryClient.invalidateQueries({ queryKey: albumKeys.details(albumId) });
      toast.success("Song deleted");
    } catch (error) {
      toast.error("Failed to delete song");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Tracklist
          <Badge variant="secondary">{items.length}</Badge>
        </h3>
        <Button
          onClick={() => {
            setEditingSong(undefined);
            setIsDialogOpen(true);
          }}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Track
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="album-songs-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((song, index) => (
                <Draggable key={song.id} draggableId={song.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-3 flex items-center gap-4 transition-colors ${
                        snapshot.isDragging
                          ? "bg-accent shadow-lg"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing p-1"
                      >
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>

                      <div className="w-6 text-center font-mono text-sm text-muted-foreground">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {song.title}
                          </span>
                          {song.isExplicit && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1"
                            >
                              E
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />{" "}
                            {formatDuration(song.duration)}
                          </span>
                          <span className="truncate max-w-[200px]">
                            {song.artists
                              ?.map((a) => a.artist?.name)
                              .join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingSong(song);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(song.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <SongDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        albumId={albumId}
        defaultArtist={defaultArtist}
        songToEdit={editingSong}
      />
    </div>
  );
}
